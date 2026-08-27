from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import TaskRecord


async def create_task(
    db: AsyncSession,
    task_id: str,
    repo_url: str,
    description: str,
    session_id: str = None
) -> TaskRecord:
    """Save a new task to the database."""
    task = TaskRecord(
        id=task_id,
        session_id=session_id,
        repo_url=repo_url,
        task_description=description,
        status="queued",
    )
    db.add(task)
    await db.commit()
    return task


async def update_task(db: AsyncSession, task_id: str, **kwargs) -> TaskRecord | None:
    """Update task fields (status, pr_url, branch_name, error, etc.)."""
    result = await db.execute(select(TaskRecord).where(TaskRecord.id == task_id))
    task = result.scalar_one_or_none()
    if task:
        for key, value in kwargs.items():
            setattr(task, key, value)
        await db.commit()
    return task


async def get_task(db: AsyncSession, task_id: str) -> TaskRecord | None:
    """Get a task by its task_id."""
    result = await db.execute(select(TaskRecord).where(TaskRecord.id == task_id))
    return result.scalar_one_or_none()


async def get_all_tasks(db: AsyncSession) -> list[TaskRecord]:
    """Get all saved tasks."""
    result = await db.execute(select(TaskRecord).order_by(TaskRecord.created_at.desc()))
    return list(result.scalars().all())
