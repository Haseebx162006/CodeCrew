from typing import Any
from settings.config import settings
from langgraph.checkpoint.memory import MemorySaver

# Checkpointer instance used across all LangGraph agents
_checkpointer: Any = None
_pool: Any = None


def get_checkpointer():
    """
    Returns the active LangGraph checkpointer.
    Defaults to MemorySaver unless initialized with Postgres.
    """
    global _checkpointer
    if _checkpointer is None:
        _checkpointer = MemorySaver()
    return _checkpointer


async def init_checkpointer():
    """
    Initializes PostgreSQL Checkpointer if DATABASE_URL is Postgres.
    Otherwise uses MemorySaver.
    """
    global _checkpointer, _pool
    db_url = settings.DATABASE_URL.strip() if settings.DATABASE_URL else ""

    if db_url.startswith("postgres://") or db_url.startswith("postgresql://"):
        try:
            from psycopg_pool import AsyncConnectionPool
            from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

            # Normalize connection string for psycopg
            clean_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
            _pool = AsyncConnectionPool(
                conninfo=clean_url,
                max_size=20,
                kwargs={"autocommit": True}
            )
            await _pool.open()
            _checkpointer = AsyncPostgresSaver(_pool)
            await _checkpointer.setup()
            return _checkpointer
        except Exception as e:
            # Fallback to MemorySaver if Postgres is unreachable
            _checkpointer = MemorySaver()
            return _checkpointer
    else:
        _checkpointer = MemorySaver()
        return _checkpointer