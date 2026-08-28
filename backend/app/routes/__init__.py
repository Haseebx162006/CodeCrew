from fastapi import APIRouter
from auth.router import router as auth_router
from routes.tasks import router as tasks_router
from routes.repos import router as repos_router

api_router = APIRouter()

# Include feature routers
api_router.include_router(auth_router)
api_router.include_router(tasks_router)
api_router.include_router(repos_router)

__all__ = ["api_router", "auth_router", "tasks_router", "repos_router"]
