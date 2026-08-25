import re
import shutil
import tempfile
import subprocess
from pathlib import Path

def _slugify(text: str, max_len: int = 40) -> str:

    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")

    return slug[:max_len] or "task" 



def clone_repo(repo_url: str, task_description: str, token: str | None = None) -> dict:
    """
    Clone repo_url into a fresh temp workspace and create a feature branch.

    Returns: {"repo_path": Path, "branch_name": str}
    """
    try:
        workspace = Path(tempfile.mkdtemp())
    except Exception as e:
        raise ValueError(f"Error creating temporary workspace: {e}")

    repo_path = workspace / "repo"

    # Inject token for private repos, if provided
    clone_url = repo_url
    if token:
        clone_url = repo_url.replace("https://", f"https://{token}@", 1)

    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", clone_url, str(repo_path)],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        # i done this to avoid exposing the token in error messages
        safe_err = e.stderr.replace(token, "***") if token else e.stderr
        raise ValueError(f"Error cloning repository: {safe_err}")

    # Create a feature branch for the agents to work on
    branch_name = f"feature/{_slugify(task_description)}"
    try:
        subprocess.run(
            ["git", "checkout", "-b", branch_name],
            cwd=repo_path,
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        raise ValueError(f"Error creating branch: {e.stderr}")

    return {"repo_path": repo_path, "branch_name": branch_name}


def cleanup_workspace(repo_path: Path) -> None:
    """Delete the temp workspace once the job is done (success or failure)."""
    workspace = repo_path.parent
    if workspace.exists():
        shutil.rmtree(workspace)


