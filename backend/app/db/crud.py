from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import TaskRecord, UserRecord


async def create_user(
    db: AsyncSession,
    user_id: str,
    email: str,
    name: str,
    hashed_password: str,
    github_username: str | None = None,
    github_access_token: str | None = None,
    address: str | None = None,
    avatar_url: str | None = None,
) -> UserRecord:
    """Create a new user record."""
    user = UserRecord(
        id=user_id,
        email=email.strip().lower(),
        name=name.strip(),
        hashed_password=hashed_password,
        github_username=github_username,
        github_access_token=github_access_token,
        address=address,
        avatar_url=avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={user_id}",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def update_user(db: AsyncSession, user_id: str, **kwargs) -> UserRecord | None:
    """Update user fields (e.g. github_access_token, github_username, etc.)."""
    result = await db.execute(select(UserRecord).where(UserRecord.id == user_id))
    user = result.scalar_one_or_none()
    if user:
        for key, value in kwargs.items():
            setattr(user, key, value)
        await db.commit()
        await db.refresh(user)
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> UserRecord | None:
    """Find a user by their email address."""
    result = await db.execute(select(UserRecord).where(UserRecord.email == email.strip().lower()))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> UserRecord | None:
    """Find a user by their unique ID."""
    result = await db.execute(select(UserRecord).where(UserRecord.id == user_id))
    return result.scalar_one_or_none()



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


async def delete_task(db: AsyncSession, task_id: str) -> bool:
    """Delete a task from the database."""
    result = await db.execute(select(TaskRecord).where(TaskRecord.id == task_id))
    task = result.scalar_one_or_none()
    if task:
        await db.delete(task)
        await db.commit()
        return True
    return False


async def get_latest_github_user(db: AsyncSession) -> UserRecord | None:
    """Get the most recently active user who has a github_access_token."""
    result = await db.execute(
        select(UserRecord)
        .where(UserRecord.github_access_token.isnot(None))
        .order_by(UserRecord.created_at.desc())
    )
    return result.scalars().first()



