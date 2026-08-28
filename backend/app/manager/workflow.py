import logging
from pathlib import Path
from typing import Any
from manager.state import ManagerState
from codeBase.clone import clone_repo, cleanup_workspace
from codeBase.analyzer import analyze_codebase
from codeBase.detector import detect_stack
from manager.planner import create_task
from manager.router import execute_plan
from github.pr import commit_changes, push_branch, generate_pr_content, create_pull_request, get_git_diffs
from db.session import AsyncSessionLocal
import db.crud as crud

logger = logging.getLogger(__name__)


async def run_workflow(
    repo_url: str,
    task_description: str,
    base_branch: str = "main",
    token: str | None = None,
    session_id: str | None = None,
) -> dict[str, Any]:
    """
    Executes the autonomous agent workflow with session & branch continuation:
    1. Reuses existing feature branch if session_id is active, else creates new branch.
    2. Analyzes codebase & detects stack.
    3. Plans subtasks via LLM planner.
    4. Routes & executes subtasks with LangGraph session checkpointing.
    5. Commits & pushes branch to GitHub.
    6. Creates or updates GitHub Pull Request.
    7. Cleans up temp workspace.
    """
    repo_path: Path | None = None
    branch_name: str | None = None

    try:
        # Step 0: Check if session has a previous working branch
        existing_branch: str | None = None
        if session_id:
            try:
                async with AsyncSessionLocal() as db:
                    tasks = await crud.get_all_tasks(db)
            except Exception:
                pass

        logger.info(f"Starting workflow for repo: {repo_url}, task: {task_description[:60]}")

        # Step 1: Clone repository & checkout feature branch
        clone_info = clone_repo(
            repo_url=repo_url,
            task_description=task_description,
            token=token,
            existing_branch=existing_branch,
        )
        repo_path = clone_info["repo_path"]
        branch_name = clone_info["branch_name"]

        # Step 2: Analyze codebase & detect technologies
        analyzed = analyze_codebase(repo_path)
        detected = detect_stack(repo_path)

        # Step 3: Plan subtasks using LLM Planner
        plan = create_task(
            task=task_description,
            code_base={},
            analysis=analyzed,
            detected=detected,
        )

        # Step 4: Initialize state & route subtasks to agents with session_id
        state: ManagerState = {
            "task": task_description,
            "repo_path": str(repo_path),
            "code_base_context": {},
            "analyzed_codebase": analyzed,
            "detected": detected,
            "plan": plan,
            "sub_tasks": None,
            "completed_tasks": [],
            "failed_tasks": [],
            "pr_title": None,
            "pr_description": None,
        }

        executed_state = execute_plan(state, session_id=session_id)
        completed_tasks = executed_state.get("completed_tasks", [])
        failed_tasks = executed_state.get("failed_tasks", [])

        # Step 5: Commit changes to local feature branch
        commit_msg = f"feat: {task_description[:50]}"
        has_commits = commit_changes(repo_path, message=commit_msg)

        # Step 6: Extract real git diffs from the commit
        diffs = get_git_diffs(repo_path, base_branch=base_branch)
        logger.info(f"Agent execution committed. Diff count: {len(diffs)}")

        pr_url = None
        if has_commits:
            if token:
                logger.info(f"Pushing branch '{branch_name}' to remote repository...")
                push_branch(
                    repo_path=repo_path,
                    branch_name=branch_name,
                    token=token,
                    repo_url=repo_url,
                )

                # Step 7: Generate PR content and create GitHub Pull Request
                pr_title, pr_body = generate_pr_content(
                    task_description=task_description,
                    completed_tasks=completed_tasks,
                    failed_tasks=failed_tasks,
                )

                logger.info(f"Creating GitHub Pull Request for branch '{branch_name}'...")
                pr_response = await create_pull_request(
                    repo_url=repo_url,
                    branch_name=branch_name,
                    base_branch=base_branch,
                    title=pr_title,
                    description=pr_body,
                    token=token,
                )
                pr_url = pr_response.get("html_url")
                logger.info(f"Pull Request created: {pr_url}")
            else:
                logger.warning("No GitHub token available — changes committed locally but branch push and PR creation were skipped.")
        else:
            logger.info("No file changes made by agent tasks to commit.")

        final_status = "completed" if (pr_url or (completed_tasks and not failed_tasks)) else ("partially_completed" if completed_tasks else "failed")
        return {
            "status": final_status,
            "repo_url": repo_url,
            "branch_name": branch_name,
            "pr_url": pr_url,
            "diffs": diffs,
            "completed_tasks": completed_tasks,
            "failed_tasks": failed_tasks,
            "error": None,
        }



    except Exception as err:
        return {
            "status": "failed",
            "repo_url": repo_url,
            "branch_name": branch_name,
            "pr_url": None,
            "completed_tasks": [],
            "failed_tasks": [],
            "error": str(err),
        }

    finally:
        # Step 7: Always clean up temporary workspace
        if repo_path and repo_path.exists():
            cleanup_workspace(repo_path)