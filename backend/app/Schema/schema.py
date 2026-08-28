import re
from typing import Literal, Any
from pydantic import BaseModel, field_validator


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
    installation_id: int | None = None
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
    diffs: list[dict[str, Any]] = []
    completed_tasks: list[dict[str, Any]] = []
    failed_tasks: list[dict[str, Any]] = []
    error: str | None = None



class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    github_username: str | None = None
    address: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty.")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, v):
            raise ValueError("Please provide a valid email address.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v


class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not v:
            raise ValueError("Email cannot be empty.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not v:
            raise ValueError("Password cannot be empty.")
        return v


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    github_username: str | None = None
    address: str | None = None
    avatar_url: str | None = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut