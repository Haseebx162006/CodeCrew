from pydantic import BaseModel
from typing import Literal, Any


class SubTask(BaseModel):
    id: str
    description: str
    agent: Literal["database", "backend", "frontend", "testing", "documentation", "docs"]
    depends_on: list[str]


class TaskPlan(BaseModel):
    subtasks: list[SubTask]


class TaskRequest(BaseModel):
    repo_url: str
    task_description: str
    base_branch: str = "main"
    github_token: str | None = None
    session_id: str | None = None


class TaskResponse(BaseModel):
    task_id: str
    session_id: str | None = None
    status: str
    message: str


class TaskStatusResponse(BaseModel):
    task_id: str
    session_id: str | None = None
    status: str  # "queued", "running", "completed", "failed"
    repo_url: str
    task_description: str
    base_branch: str = "main"
    branch_name: str | None = None
    pr_url: str | None = None
    completed_tasks: list[dict[str, Any]] = []
    failed_tasks: list[dict[str, Any]] = []
    error: str | None = None