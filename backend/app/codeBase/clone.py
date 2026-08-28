import re
import shutil
import tempfile
import subprocess
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def _slugify(text: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return slug[:max_len] or "task"


def clone_repo(
    repo_url: str,
    task_description: str,
    token: str | None = None,
    existing_branch: str | None = None,
) -> dict:
    """
    Clone repo_url into a fresh temp workspace.
    Reuses existing_branch if provided, otherwise creates a new feature branch.

    Returns: {"repo_path": Path, "branch_name": str}
    """
    try:
        workspace = Path(tempfile.mkdtemp())
    except Exception as e:
        raise ValueError(f"Error creating temporary workspace: {e}")

    repo_path = workspace / "repo"

    # Use x-access-token for GitHub App installation tokens
    clone_url = repo_url
    if token:
        clone_url = repo_url.replace("https://", f"https://x-access-token:{token}@", 1)

    branch_name = existing_branch or f"feature/{_slugify(task_description)}"

    # 1. Clone repository (full clone, not shallow, so we can push new branches)
    clone_cmd = ["git", "clone"]
    if existing_branch:
        clone_cmd.extend(["--branch", existing_branch])
    clone_cmd.extend([clone_url, str(repo_path)])

    try:
        subprocess.run(
            clone_cmd,
            check=True,
            capture_output=True,
            text=True,
        )
        logger.info(f"Cloned {repo_url} into {repo_path}")
    except subprocess.CalledProcessError:
        # If cloning specific branch fails, fallback to default clone
        try:
            subprocess.run(
                ["git", "clone", clone_url, str(repo_path)],
                check=True,
                capture_output=True,
                text=True,
            )
            logger.info(f"Cloned {repo_url} (default branch) into {repo_path}")
        except subprocess.CalledProcessError as e:
            safe_err = e.stderr.replace(token, "***") if token else e.stderr
            raise ValueError(f"Error cloning repository: {safe_err}")

    # 2. If new branch, create and checkout
    if not existing_branch:
        try:
            subprocess.run(
                ["git", "checkout", "-b", branch_name],
                cwd=repo_path,
                check=True,
                capture_output=True,
                text=True,
            )
            logger.info(f"Created and checked out branch: {branch_name}")
        except subprocess.CalledProcessError:
            pass

    return {"repo_path": repo_path, "branch_name": branch_name}


def cleanup_workspace(repo_path: Path) -> None:
    """Delete the temp workspace once the job is done."""
    workspace = repo_path.parent
    if workspace.exists():
        shutil.rmtree(workspace)
