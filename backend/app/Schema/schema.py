from pydantic import BaseModel
from typing import Literal


class SubTask(BaseModel):
    id: str
    description: str
    agent: Literal["database", "backend", "frontend", "testing"]
    depends_on: list[str]


class TaskPlan(BaseModel):
    subtasks: list[SubTask]