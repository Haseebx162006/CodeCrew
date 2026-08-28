from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from db.session import Base


class TaskRecord(Base):
    """
    Stores each user task, status, and resulting GitHub Pull Request.
    """
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=True)
    repo_url = Column(String, nullable=False)
    task_description = Column(Text, nullable=False)
    base_branch = Column(String, default="main")
    branch_name = Column(String, nullable=True)
    pr_url = Column(String, nullable=True)
    status = Column(String, default="queued")  # queued, running, completed, failed
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserRecord(Base):
    """
    Stores user account information and authentication credentials.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    github_username = Column(String, nullable=True)
    github_access_token = Column(String, nullable=True)
    address = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

