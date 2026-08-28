from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from settings.config import settings


# Base class for database models
Base = declarative_base()

# Async Database connection engine
engine = create_async_engine(
    settings.async_database_url,
    pool_pre_ping=True,
    pool_recycle=300,
)

# Session factory to interact with DB



AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    """Dependency for getting async DB sessions."""
    async with AsyncSessionLocal() as session:
        yield session


from sqlalchemy import text


async def init_db():
    """Create all database tables on startup and ensure required columns exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Ensure recently added columns exist
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS github_access_token VARCHAR;"))
        except Exception:
            pass


