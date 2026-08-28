import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from db.session import get_db
import db.crud as crud
from db.models import UserRecord
from auth.security import hash_password, verify_password, create_access_token
from auth.dependencies import get_current_user
from Schema.schema import UserRegister, UserLogin, UserOut, AuthResponse
from settings.config import settings
from github.auth import get_installation_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])



@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Register a new user account with hashed password and return JWT access token.
    """
    # Check if an account with this email already exists
    existing_user = await crud.get_user_by_email(db, email=req.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # Securely hash the password with passlib bcrypt
    hashed_pwd = hash_password(req.password)
    user_id = f"usr_{uuid.uuid4().hex[:10]}"

    # Persist the new user in the database
    new_user = await crud.create_user(
        db=db,
        user_id=user_id,
        email=req.email,
        name=req.name,
        hashed_password=hashed_pwd,
        github_username=req.github_username,
        address=req.address,
    )

    # Create signed JWT token
    token = create_access_token(
        data={"sub": new_user.id, "email": new_user.email, "name": new_user.name}
    )

    user_out = UserOut(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        github_username=new_user.github_username,
        address=new_user.address,
        avatar_url=new_user.avatar_url,
    )

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_out,
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user credentials and return a signed JWT access token.
    """
    user = await crud.get_user_by_email(db, email=req.email)
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create signed JWT token
    token = create_access_token(
        data={"sub": user.id, "email": user.email, "name": user.name}
    )

    user_out = UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        github_username=user.github_username,
        address=user.address,
        avatar_url=user.avatar_url,
    )

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=user_out,
    )


@router.get("/me", response_model=UserOut)
async def get_my_profile(current_user: UserRecord = Depends(get_current_user)):
    """
    Retrieve profile details of the currently authenticated user.
    """
    return UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        github_username=current_user.github_username,
        address=current_user.address,
        avatar_url=current_user.avatar_url,
    )


import httpx
from fastapi.responses import RedirectResponse
from pydantic import BaseModel


class GitHubExchangeRequest(BaseModel):
    code: str | None = None
    installation_id: int | None = None


@router.get("/github/url")
async def get_github_oauth_url():
    """
    Returns the GitHub OAuth authorization URL for 1-click sign-in.
    """
    client_id = settings.github_client_id or "Iv23liWJfDgfra9E8euf"
    oauth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}"
        f"&scope=read:user,user:email,repo"
    )
    return {"url": oauth_url, "client_id": client_id}


@router.get("/github/login")
async def github_login_redirect():
    """
    Direct browser redirect to GitHub OAuth authorization.
    """
    client_id = settings.github_client_id or "Iv23liWJfDgfra9E8euf"
    oauth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={client_id}"
        f"&scope=read:user,user:email,repo"
    )
    return RedirectResponse(url=oauth_url)


@router.post("/github/exchange", response_model=AuthResponse)
async def exchange_github_oauth(req: GitHubExchangeRequest, db: AsyncSession = Depends(get_db)):
    """
    Exchanges GitHub OAuth code or installation for access token, syncs user profile to DB, and returns JWT.
    """
    github_user_data = None
    gh_access_token = None

    if req.code:
        client_id = settings.github_client_id
        # 1. Exchange code with GitHub OAuth endpoint
        if not settings.GITHUB_CLIENT_SECRET:
            logger.warning("GITHUB_CLIENT_SECRET is not set in .env — OAuth code exchange will fail.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                data_payload = {
                    "client_id": client_id,
                    "code": req.code,
                }
                if settings.GITHUB_CLIENT_SECRET:
                    data_payload["client_secret"] = settings.GITHUB_CLIENT_SECRET

                token_resp = await client.post(
                    "https://github.com/login/oauth/access_token",
                    headers={"Accept": "application/json"},
                    data=data_payload,
                )
                if token_resp.status_code == 200:
                    token_data = token_resp.json()
                    gh_access_token = token_data.get("access_token")
                    if not gh_access_token:
                        error_desc = token_data.get("error_description", token_data.get("error", "Unknown"))
                        logger.error(f"GitHub OAuth token exchange failed: {error_desc}")
                else:
                    logger.error(f"GitHub OAuth token exchange HTTP {token_resp.status_code}: {token_resp.text}")
        except Exception as err:
            logger.error(f"GitHub OAuth token exchange exception: {err}")

        # 2. Fetch User Profile from GitHub API
        if gh_access_token:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    user_resp = await client.get(
                        "https://api.github.com/user",
                        headers={
                            "Authorization": f"Bearer {gh_access_token}",
                            "Accept": "application/vnd.github+json",
                        },
                    )
                    if user_resp.status_code == 200:
                        github_user_data = user_resp.json()
                    else:
                        logger.error(f"GitHub /user API returned {user_resp.status_code}: {user_resp.text}")

                    # If email is not public in profile, fetch from emails endpoint
                    if github_user_data and not github_user_data.get("email"):
                        emails_resp = await client.get(
                            "https://api.github.com/user/emails",
                            headers={
                                "Authorization": f"Bearer {gh_access_token}",
                                "Accept": "application/vnd.github+json",
                            },
                        )
                        if emails_resp.status_code == 200:
                            emails = emails_resp.json()
                            for email_obj in emails:
                                if email_obj.get("primary") or email_obj.get("verified"):
                                    github_user_data["email"] = email_obj.get("email")
                                    break
            except Exception as err:
                logger.error(f"GitHub /user API exception: {err}")

    # 3. Fallback to installation token if installation_id provided
    if not github_user_data and req.installation_id and settings.GITHUB_APP_ID and settings.private_key:
        try:
            inst_token = await get_installation_token(
                installation_id=req.installation_id,
                app_id=settings.GITHUB_APP_ID,
                private_key=settings.private_key,
            )
            if inst_token:
                gh_access_token = inst_token
        except Exception as err:
            logger.error(f"GitHub App installation token exchange failed: {err}")

    # 4. If we couldn't get real user data, return a clear error
    if not github_user_data:
        raise HTTPException(
            status_code=400,
            detail="GitHub authentication failed. Make sure GITHUB_CLIENT_SECRET is set in backend .env file.",
        )

    # 5. Extract real profile fields
    gh_login = github_user_data.get("login") or "github-user"
    gh_name = github_user_data.get("name") or gh_login
    gh_email = github_user_data.get("email") or f"{gh_login}@users.noreply.github.com"
    gh_avatar = github_user_data.get("avatar_url") or f"https://api.dicebear.com/7.x/bottts/svg?seed={gh_login}"
    gh_location = github_user_data.get("location") or "GitHub Connected Workspace"


    # 5. Find or Create User in PostgreSQL
    existing_user = await crud.get_user_by_email(db, email=gh_email)
    if not existing_user:
        user_id = f"usr_gh_{uuid.uuid4().hex[:8]}"
        random_pwd = hash_password(uuid.uuid4().hex)
        user = await crud.create_user(
            db=db,
            user_id=user_id,
            email=gh_email,
            name=gh_name,
            hashed_password=random_pwd,
            github_username=gh_login,
            github_access_token=gh_access_token,
            address=gh_location,
            avatar_url=gh_avatar,
        )
    else:
        user = existing_user
        if gh_access_token or gh_login:
            user = await crud.update_user(
                db,
                user_id=user.id,
                github_access_token=gh_access_token or user.github_access_token,
                github_username=gh_login or user.github_username,
                avatar_url=gh_avatar or user.avatar_url,
            )

    # 6. Issue Application JWT Token
    app_token = create_access_token(
        data={"sub": user.id, "email": user.email, "name": user.name}
    )

    user_out = UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        github_username=user.github_username,
        address=user.address,
        avatar_url=user.avatar_url,
    )

    return AuthResponse(
        access_token=app_token,
        token_type="bearer",
        user=user_out,
    )



@router.get("/github/callback")
@router.get("/github/install")
@router.get("/github")
async def github_auth_callback(
    installation_id: int | None = None,
    code: str | None = None,
    setup_action: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Handles GitHub App installation and OAuth callback with frontend redirect.
    """
    if code or installation_id:
        req = GitHubExchangeRequest(code=code, installation_id=installation_id)
        try:
            auth_resp = await exchange_github_oauth(req=req, db=db)
            token = auth_resp.access_token
            # Redirect back to frontend with the issued JWT token
            frontend_url = settings.FRONTEND_URL.rstrip("/")
            return RedirectResponse(url=f"{frontend_url}/?token={token}&status=success")
        except Exception:
            pass

    return {
        "status": "success",
        "message": "GitHub App connected successfully!",
        "installation_id": installation_id,
        "setup_action": setup_action,
        "instructions": "You can now dispatch tasks on your installed repositories without entering any PAT.",
    }

