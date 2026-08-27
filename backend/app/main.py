import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from db.session import init_db, AsyncSessionLocal
import db.crud as crud
from Schema.schema import TaskRequest, TaskResponse, TaskStatusResponse
from manager.workflow import run_workflow


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables automatically on startup
    await init_db()
    yield


app = FastAPI(
    title="Software House Agent API",
    description="Autonomous Multi-Agent Coding Service",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok", "message": "Agent service is running"}


async def process_task(task_id: str, req: TaskRequest):
    """Background worker that runs the agent workflow and updates DB."""
    async with AsyncSessionLocal() as db:
        await crud.update_task(db, task_id, status="running")

    try:
        # Run the full agent pipeline
        result = await run_workflow(
            repo_url=req.repo_url,
            task_description=req.task_description,
            base_branch=req.base_branch,
            token=req.github_token,
        )

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

    except Exception as err:
        async with AsyncSessionLocal() as db:
            await crud.update_task(db, task_id, status="failed", error=str(err))


@app.post("/api/tasks", response_model=TaskResponse)
async def create_new_task(req: TaskRequest, background_tasks: BackgroundTasks):
    """1. Submit a new task for an agent to work on a GitHub repository."""
    task_id = f"task_{uuid.uuid4().hex[:8]}"
    session_id = req.session_id or f"sess_{uuid.uuid4().hex[:8]}"

    # Save to database
    async with AsyncSessionLocal() as db:
        await crud.create_task(
            db=db,
            task_id=task_id,
            repo_url=req.repo_url,
            description=req.task_description,
            session_id=session_id,
        )

    # Run in background
    background_tasks.add_task(process_task, task_id, req)

    return TaskResponse(
        task_id=task_id,
        session_id=session_id,
        status="queued",
        message="Task received and started in background."
    )


@app.get("/api/tasks/{task_id}", response_model=TaskStatusResponse)
async def check_task_status(task_id: str):
    """2. Check progress, status, and PR URL of a specific task."""
    async with AsyncSessionLocal() as db:
        task = await crud.get_task(db, task_id=task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return TaskStatusResponse(
        task_id=task.id,
        session_id=task.session_id,
        status=task.status,
        repo_url=task.repo_url,
        task_description=task.task_description,
        base_branch=task.base_branch,
        branch_name=task.branch_name,
        pr_url=task.pr_url,
        error=task.error,
    )


@app.get("/api/tasks")
async def list_all_tasks():
    """3. List all previous and current tasks."""
    async with AsyncSessionLocal() as db:
        tasks = await crud.get_all_tasks(db)

    return [
        {
            "task_id": t.id,
            "session_id": t.session_id,
            "status": t.status,
            "task_description": t.task_description,
            "repo_url": t.repo_url,
            "branch_name": t.branch_name,
            "pr_url": t.pr_url,
        }
        for t in tasks
    ]
