import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from settings.config import settings
from db.session import AsyncSessionLocal
import db.crud as crud
from github.auth import get_installation_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/repos", tags=["Repositories"])


class RepoValidateRequest(BaseModel):
    url: str


@router.get("")
@router.get("/")
async def list_repositories(username: str | None = None):
    """
    List connected repositories from GitHub App installation, authenticated user, or public GitHub account.
    """
    repos = []
    target_username = username.strip() if username else "Haseebx162006"

    # 1. Try to fetch from GitHub App Installation
    if settings.GITHUB_APP_ID and settings.private_key:
        try:
            # Check all installations for the GitHub App
            import jwt, time
            now = int(time.time())
            payload = {
                "iat": now - 60,
                "exp": now + (10 * 60),
                "iss": settings.GITHUB_APP_ID,
            }
            app_jwt = jwt.encode(payload, settings.private_key, algorithm="RS256")

            async with httpx.AsyncClient(timeout=8.0) as client:
                inst_resp = await client.get(
                    "https://api.github.com/app/installations",
                    headers={
                        "Authorization": f"Bearer {app_jwt}",
                        "Accept": "application/vnd.github+json",
                    },
                )
                if inst_resp.status_code == 200:
                    installations = inst_resp.json()
                    if installations and len(installations) > 0:
                        inst_id = installations[0].get("id")
                        inst_token = await get_installation_token(
                            installation_id=inst_id,
                            app_id=settings.GITHUB_APP_ID,
                            private_key=settings.private_key,
                        )
                        if inst_token:
                            repo_resp = await client.get(
                                "https://api.github.com/installation/repositories?per_page=100",
                                headers={
                                    "Authorization": f"Bearer {inst_token}",
                                    "Accept": "application/vnd.github+json",
                                },
                            )
                            if repo_resp.status_code == 200:
                                gh_repos = repo_resp.json().get("repositories", [])
                                for r in gh_repos:
                                    repos.append({
                                        "id": f"repo-{r.get('id')}",
                                        "name": r.get("name"),
                                        "fullName": r.get("full_name"),
                                        "owner": r.get("owner", {}).get("login"),
                                        "url": r.get("html_url"),
                                        "defaultBranch": r.get("default_branch", "main"),
                                        "branches": [r.get("default_branch", "main")],
                                        "language": r.get("language") or "Python",
                                        "stars": r.get("stargazers_count", 0),
                                        "isPrivate": r.get("private", False),
                                        "description": r.get("description") or "Connected GitHub Repository",
                                    })
                                if repos:
                                    logger.info(f"Loaded {len(repos)} repositories from GitHub App installation")
                                    return repos
        except Exception as e:
            logger.warning(f"Error fetching repos via GitHub App: {e}")

    # 2. Try stored user token from database
    try:
        async with AsyncSessionLocal() as db:
            user = await crud.get_latest_github_user(db)
            if user and user.github_access_token:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(
                        "https://api.github.com/user/repos?sort=updated&per_page=50",
                        headers={
                            "Authorization": f"Bearer {user.github_access_token}",
                            "Accept": "application/vnd.github+json",
                        },
                    )
                    if resp.status_code == 200:
                        gh_repos = resp.json()
                        for r in gh_repos:
                            repos.append({
                                "id": f"repo-{r.get('id')}",
                                "name": r.get("name"),
                                "fullName": r.get("full_name"),
                                "owner": r.get("owner", {}).get("login"),
                                "url": r.get("html_url"),
                                "defaultBranch": r.get("default_branch", "main"),
                                "branches": [r.get("default_branch", "main")],
                                "language": r.get("language") or "Python",
                                "stars": r.get("stargazers_count", 0),
                                "isPrivate": r.get("private", False),
                                "description": r.get("description") or "Connected GitHub Repository",
                            })
                        if repos:
                            return repos
    except Exception as e:
        logger.warning(f"Error fetching repos via user token: {e}")

    # 3. Fallback to public repos of username / Haseebx162006
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                f"https://api.github.com/users/{target_username}/repos?sort=updated&per_page=50",
                headers={"Accept": "application/vnd.github+json"},
            )
            if resp.status_code == 200:
                gh_repos = resp.json()
                for r in gh_repos:
                    repos.append({
                        "id": f"repo-{r.get('id')}",
                        "name": r.get("name"),
                        "fullName": r.get("full_name"),
                        "owner": r.get("owner", {}).get("login"),
                        "url": r.get("html_url"),
                        "defaultBranch": r.get("default_branch", "main"),
                        "branches": [r.get("default_branch", "main")],
                        "language": r.get("language") or "Python",
                        "stars": r.get("stargazers_count", 0),
                        "isPrivate": r.get("private", False),
                        "description": r.get("description") or "Public GitHub Repository",
                    })
    except Exception as e:
        logger.warning(f"Error fetching public repos: {e}")

    return repos


@router.post("/validate")
async def validate_repository(req: RepoValidateRequest):
    """
    Validates a repository URL and extracts metadata & branches from GitHub.
    """
    clean_url = req.url.strip()
    if not clean_url.startswith("http"):
        clean_url = f"https://github.com/{clean_url.lstrip('/')}"

    parts = clean_url.rstrip("/").replace("https://github.com/", "").split("/")
    if len(parts) < 2:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub repository URL format. Example: https://github.com/owner/repo",
        )

    owner, repo_name = parts[0], parts[1]
    branches = ["main"]
    default_branch = "main"
    description = "Connected GitHub Repository"
    language = "Python"
    stars = 0

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                f"https://api.github.com/repos/{owner}/{repo_name}",
                headers={"Accept": "application/vnd.github+json"},
            )
            if resp.status_code == 200:
                data = resp.json()
                default_branch = data.get("default_branch", "main")
                description = data.get("description") or description
                language = data.get("language") or language
                stars = data.get("stargazers_count", 0)

            # Fetch branches
            b_resp = await client.get(
                f"https://api.github.com/repos/{owner}/{repo_name}/branches?per_page=10",
                headers={"Accept": "application/vnd.github+json"},
            )
            if b_resp.status_code == 200:
                b_data = b_resp.json()
                branches = [b.get("name") for b in b_data if b.get("name")]
                if default_branch not in branches:
                    branches.insert(0, default_branch)
    except Exception:
        pass

    return {
        "id": f"repo-custom-{owner}-{repo_name}",
        "name": repo_name,
        "fullName": f"{owner}/{repo_name}",
        "owner": owner,
        "url": clean_url,
        "defaultBranch": default_branch,
        "branches": branches or ["main"],
        "language": language,
        "stars": stars,
        "isPrivate": False,
        "description": description,
    }
