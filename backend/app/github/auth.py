import time 
import httpx 
import jwt
from typing import Any

def create_github_jwt(app_id: str, private_key: str) -> str:
    """
    Create a GitHub JWT for authentication.

    Args:
        app_id (str): The GitHub App ID.
        private_key (str): The private key of the GitHub App in PEM format.

    Returns:
        str: The generated JWT.
    """
    current_time = int(time.time())

    # Now i will generate the paload for the JWT

    try:
        payload = {
            "iat": current_time,  # Issued at time
            "exp": current_time + (10 * 60),  # Expiration time (10 minutes)
            "iss": app_id,  # GitHub App ID
        }
        token = jwt.encode(payload, private_key, algorithm="RS256")
        return token


    except Exception as e:
        raise ValueError(f"Error creating JWT payload: {e}")



async def get_installation_token(
    installation_id: int,
    app_id: str,
    private_key: str
) -> str:
    app_jwt = create_github_jwt(
        app_id,
        private_key
    )

    url = (
        f"https://api.github.com/app/installations/"
        f"{installation_id}/access_tokens"
    )

    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["token"]


async def get_repo_installation_token(
    owner: str,
    repo: str,
    app_id: str,
    private_key: str,
) -> str | None:
    """
    Auto-discovers the installation ID for a specific repository or user and returns an access token.
    """
    if not app_id or not private_key:
        return None

    try:
        app_jwt = create_github_jwt(app_id, private_key)
        headers = {
            "Authorization": f"Bearer {app_jwt}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Check repository installation
            resp = await client.get(
                f"https://api.github.com/repos/{owner}/{repo}/installation",
                headers=headers,
            )
            if resp.status_code == 200:
                inst_id = resp.json().get("id")
                if inst_id:
                    return await get_installation_token(inst_id, app_id, private_key)

            # 2. Check user/org installation
            resp = await client.get(
                f"https://api.github.com/users/{owner}/installation",
                headers=headers,
            )
            if resp.status_code == 200:
                inst_id = resp.json().get("id")
                if inst_id:
                    return await get_installation_token(inst_id, app_id, private_key)

            # 3. List installations and match owner
            resp = await client.get(
                "https://api.github.com/app/installations",
                headers=headers,
            )
            if resp.status_code == 200:
                installations = resp.json()
                for inst in installations:
                    account_login = inst.get("account", {}).get("login")
                    if account_login and account_login.lower() == owner.lower():
                        return await get_installation_token(inst["id"], app_id, private_key)
    except Exception as err:
        print(f"Failed to auto-resolve installation token for {owner}/{repo}: {err}")

    return None


async def resolve_github_token_for_repo(
    owner: str,
    repo: str,
    explicit_token: str | None = None,
    installation_id: int | None = None,
    db_session: Any = None,
) -> str | None:
    """
    Resolves a valid GitHub token using a 4-tier resolution hierarchy:
    1. Explicit token provided with the request.
    2. Stored user OAuth access token in the database.
    3. Auto-resolved GitHub App installation token (via .pem and GITHUB_APP_ID).
    4. Server environment fallback token (settings.GITHUB_TOKEN or GITHUB_PAT).
    """
    import os
    from settings.config import settings

    # 1. Explicit token provided with task
    if explicit_token and explicit_token.strip():
        return explicit_token.strip()

    # 2. Provided installation_id
    if installation_id and settings.GITHUB_APP_ID and settings.private_key:
        try:
            token = await get_installation_token(
                installation_id=installation_id,
                app_id=settings.GITHUB_APP_ID,
                private_key=settings.private_key,
            )
            if token:
                return token
        except Exception:
            pass

    # 3. Auto-resolve repository installation token via GitHub App
    if settings.GITHUB_APP_ID and settings.private_key:
        try:
            token = await get_repo_installation_token(
                owner=owner,
                repo=repo,
                app_id=settings.GITHUB_APP_ID,
                private_key=settings.private_key,
            )
            if token:
                return token
        except Exception:
            pass

    # 4. Authenticated user's OAuth access token from database
    if db_session is not None:
        try:
            import db.crud as crud
            gh_user = await crud.get_latest_github_user(db_session)
            if gh_user and gh_user.github_access_token:
                return gh_user.github_access_token
        except Exception:
            pass

    # 5. Server-level environment fallback token (GITHUB_TOKEN / GITHUB_PAT)
    env_token = settings.resolved_github_token or os.getenv("GITHUB_TOKEN") or os.getenv("GITHUB_PAT")
    if env_token and env_token.strip():
        return env_token.strip()

    return None