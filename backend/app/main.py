import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure current app directory is in sys.path
APP_DIR = str(Path(__file__).resolve().parent)
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from db.session import init_db
from db.checkpointer import init_checkpointer
from routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables and checkpointer upon application startup."""
    await init_db()
    await init_checkpointer()
    yield


app = FastAPI(
    title="Software House Agent API",
    description="Autonomous Multi-Agent Software Development Collective",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend service uptime."""
    return {"status": "ok", "message": "Software House Agent service is running"}


# Mount all modular API routes
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
