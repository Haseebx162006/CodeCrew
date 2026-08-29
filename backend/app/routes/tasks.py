import uuid
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from db.session import AsyncSessionLocal
import db.crud as crud
from settings.config import settings
from github.auth import get_installation_token
from Schema.schema import TaskRequest, TaskResponse, TaskStatusResponse
from manager.workflow import run_workflow

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


# In-memory execution results cache for real diffs and logs
_TASK_RESULTS: dict[str, dict] = {}


from github.pr import parse_repo_info
from github.auth import get_installation_token, get_repo_installation_token, resolve_github_token_for_repo


async def process_task(task_id: str, req: TaskRequest):
    """Background worker that executes the multi-agent workflow and persists status."""
    async with AsyncSessionLocal() as db:
        await crud.update_task(db, task_id, status="running")

    try:
        owner, repo_name = parse_repo_info(req.repo_url)

        # Resolve token using 4-tier hierarchy (explicit, DB OAuth, GitHub App, env fallback)
        async with AsyncSessionLocal() as db:
            token = await resolve_github_token_for_repo(
                owner=owner,
                repo=repo_name,
                explicit_token=req.github_token,
                installation_id=req.installation_id,
                db_session=db,
            )

        if token:
            logger.info(f"[{task_id}] Successfully resolved GitHub token for repository: {owner}/{repo_name}")
        else:
            logger.warning(
                f"[{task_id}] No GitHub access token resolved. Push and PR creation will be skipped. "
                f"To fix: Provide GITHUB_TOKEN in backend .env, connect GitHub in workspace, or install GitHub App on {owner}/{repo_name}."
            )

        # Run the full agent pipeline with session memory & branch continuation
        result = await run_workflow(
            repo_url=req.repo_url,
            task_description=req.task_description,
            base_branch=req.base_branch,
            token=token,
            session_id=req.session_id,
        )

        _TASK_RESULTS[task_id] = result


        # Save results to DB
        async with AsyncSessionLocal() as db:
            await crud.update_task(
                db,
                task_id,
                status=result.get("status", "completed"),
                branch_name=result.get("branch_name"),
                pr_url=result.get("pr_url"),
                error=result.get("error"),
            )

        if result.get("pr_url"):
            logger.info(f"[{task_id}] PR created: {result['pr_url']}")
        else:
            logger.warning(f"[{task_id}] Workflow completed but no PR was created. Status={result.get('status')}")

    except Exception as err:
        logger.error(f"[{task_id}] Task failed with exception: {err}", exc_info=True)
        _TASK_RESULTS[task_id] = {"status": "failed", "error": str(err), "diffs": []}
        async with AsyncSessionLocal() as db:
            await crud.update_task(db, task_id, status="failed", error=str(err))


@router.post("", response_model=TaskResponse)
@router.post("/", response_model=TaskResponse)
async def create_new_task(req: TaskRequest, background_tasks: BackgroundTasks):
    """
    Submit a new task or revision for an agent on a GitHub repository.
    """
    task_id = f"task_{uuid.uuid4().hex[:8]}"
    session_id = req.session_id or f"sess_{uuid.uuid4().hex[:8]}"
    req.session_id = session_id

    # Save to database
    async with AsyncSessionLocal() as db:
        await crud.create_task(
            db=db,
            task_id=task_id,
            repo_url=req.repo_url,
            description=req.task_description,
            session_id=session_id,
        )

    # Dispatch to background task runner
    background_tasks.add_task(process_task, task_id, req)

    return TaskResponse(
        task_id=task_id,
        session_id=session_id,
        status="queued",
        message="Task received and started in background.",
    )


@router.get("/{task_id}", response_model=TaskStatusResponse)
async def check_task_status(task_id: str):
    """
    Check progress, status, and PR URL of a specific task.
    """
    async with AsyncSessionLocal() as db:
        task = await crud.get_task(db, task_id=task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    cached_result = _TASK_RESULTS.get(task_id, {})

    return TaskStatusResponse(
        task_id=task.id,
        session_id=task.session_id,
        status=task.status,
        repo_url=task.repo_url,
        task_description=task.task_description,
        base_branch=task.base_branch,
        branch_name=task.branch_name,
        pr_url=task.pr_url,
        diffs=cached_result.get("diffs", []),
        completed_tasks=cached_result.get("completed_tasks", []),
        failed_tasks=cached_result.get("failed_tasks", []),
        error=task.error or cached_result.get("error"),
    )



@router.get("")
@router.get("/")
async def list_all_tasks():
    """
    List all previous and current tasks recorded in the database.
    """
    async with AsyncSessionLocal() as db:
        tasks = await crud.get_all_tasks(db)

    return [
        {
            "task_id": t.id,
            "session_id": t.session_id,
            "status": t.status,
            "task_description": t.task_description,
            "repo_url": t.repo_url,
            "base_branch": t.base_branch,
            "branch_name": t.branch_name,
            "pr_url": t.pr_url,
            "error": t.error,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        }
        for t in tasks
    ]


from github.pr import parse_repo_info, merge_pull_request


@router.post("/{task_id}/merge")
async def merge_task(task_id: str):
    """
    Merges the pull request on GitHub via the REST API and marks the task as merged in PostgreSQL.
    """
    async with AsyncSessionLocal() as db:
        task = await crud.get_task(db, task_id=task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        # If task has a PR URL, attempt to merge it on GitHub
        github_merge_result = None
        if task.pr_url and "/pull/" in task.pr_url:
            try:
                owner, repo_name = parse_repo_info(task.repo_url)
                pr_number = int(task.pr_url.split("/pull/")[-1].split("/")[0])

                # Resolve token using 4-tier hierarchy
                token = await resolve_github_token_for_repo(
                    owner=owner,
                    repo=repo_name,
                    db_session=db,
                )

                if token:
                    github_merge_result = await merge_pull_request(
                        repo_url=task.repo_url,
                        pr_number=pr_number,
                        token=token,
                        commit_title=f"Merge PR #{pr_number}: {task.task_description[:50]}",
                    )
                    logger.info(f"GitHub merge result for {task_id}: {github_merge_result}")
                else:
                    logger.warning(f"No token available to merge PR on GitHub for task {task_id}")
            except Exception as err:
                logger.error(f"Failed to merge PR on GitHub for task {task_id}: {err}")

        await crud.update_task(db, task_id, status="merged")

    return {
        "status": "success",
        "message": f"Task {task_id} successfully merged.",
        "github_merge": github_merge_result,
    }


@router.delete("/{task_id}")
async def remove_task(task_id: str):
    """
    Delete a task record from the database.
    """
    async with AsyncSessionLocal() as db:
        deleted = await crud.delete_task(db, task_id=task_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success", "message": f"Task {task_id} deleted."}

