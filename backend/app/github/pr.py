import re
import subprocess
import logging
from pathlib import Path
from typing import Any
from github.client import github_client

logger = logging.getLogger(__name__)


def parse_repo_info(repo_url: str) -> tuple[str, str]:
    """
    Extracts (owner, repo_name) from a GitHub repository URL.
    Examples:
      - https://github.com/octocat/Hello-World.git -> ('octocat', 'Hello-World')
      - https://github.com/octocat/Hello-World -> ('octocat', 'Hello-World')
      - git@github.com:octocat/Hello-World.git -> ('octocat', 'Hello-World')
    """
    cleaned = repo_url.strip().rstrip("/")
    if cleaned.endswith(".git"):
        cleaned = cleaned[:-4]

    pattern = r"(?:https?://github\.com/|git@github\.com:)([^/]+)/([^/]+)"
    match = re.search(pattern, cleaned)
    if not match:
        raise ValueError(f"Could not parse GitHub repository owner and name from: {repo_url}")

    return match.group(1), match.group(2)


def commit_changes(
    repo_path: Path,
    message: str = "feat: Autonomous agent changes"
) -> bool:
    """
    Stages all changes and commits them in the local repository.
    Returns True if a commit was made, False if there were no changes.
    """
    # Ensure git config has a committer identity
    subprocess.run(
        ["git", "config", "user.name", "Software House Agent"],
        cwd=repo_path,
        capture_output=True,
        text=True,
    )
    subprocess.run(
        ["git", "config", "user.email", "agent@softwarehouse.ai"],
        cwd=repo_path,
        capture_output=True,
        text=True,
    )

    # Stage all modifications and additions
    subprocess.run(
        ["git", "add", "-A"],
        cwd=repo_path,
        check=True,
        capture_output=True,
        text=True,
    )

    # Check if there are staged changes to commit
    status_proc = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=repo_path,
        capture_output=True,
        text=True,
    )

    if not status_proc.stdout.strip():
        # No changes to commit
        return False

    commit_proc = subprocess.run(
        ["git", "commit", "-m", message],
        cwd=repo_path,
        check=True,
        capture_output=True,
        text=True,
    )
    return commit_proc.returncode == 0


def get_git_diffs(repo_path: Path, base_branch: str = "main") -> list[dict[str, Any]]:
    """
    Extracts real file diffs and additions/deletions from the local git repository.
    """
    diffs = []
    try:
        proc = subprocess.run(
            ["git", "diff", f"origin/{base_branch}...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
        )
        raw_diff = proc.stdout
        if not raw_diff:
            proc = subprocess.run(
                ["git", "diff", "HEAD~1", "HEAD"],
                cwd=repo_path,
                capture_output=True,
                text=True,
            )
            raw_diff = proc.stdout
        if not raw_diff:
            proc = subprocess.run(
                ["git", "diff", "HEAD"],
                cwd=repo_path,
                capture_output=True,
                text=True,
            )
            raw_diff = proc.stdout

        if raw_diff:
            chunks = raw_diff.split("diff --git ")
            for chunk in chunks:
                if not chunk.strip():
                    continue
                lines = chunk.split("\n")
                first_line = lines[0]
                parts = first_line.split(" ")
                filename = parts[-1].lstrip("b/").strip() if len(parts) > 1 else "modified_file"
                
                additions = sum(1 for l in lines if l.startswith("+") and not l.startswith("+++"))
                deletions = sum(1 for l in lines if l.startswith("-") and not l.startswith("---"))
                
                status = "modified"
                if "new file mode" in chunk:
                    status = "added"
                elif "deleted file mode" in chunk:
                    status = "deleted"

                diffs.append({
                    "filename": filename,
                    "status": status,
                    "additions": additions,
                    "deletions": deletions,
                    "diffHunk": "\n".join(lines[1:]),
                })
    except Exception:
        pass
    return diffs


def push_branch(
    repo_path: Path,
    branch_name: str,
    token: str | None = None,
    repo_url: str | None = None,
) -> None:
    """
    Pushes the local feature branch to the remote origin.
    """
    if token and repo_url:
        owner, repo = parse_repo_info(repo_url)
        auth_remote = f"https://x-access-token:{token}@github.com/{owner}/{repo}.git"
        subprocess.run(
            ["git", "remote", "set-url", "origin", auth_remote],
            cwd=repo_path,
            check=True,
            capture_output=True,
            text=True,
        )
        logger.info(f"Set authenticated remote for {owner}/{repo}")
    elif not token:
        logger.warning("push_branch called without a token — push will likely fail for private repos")

    try:
        result = subprocess.run(
            ["git", "push", "-u", "origin", branch_name],
            cwd=repo_path,
            check=True,
            capture_output=True,
            text=True,
        )
        logger.info(f"Successfully pushed branch '{branch_name}' to origin")
    except subprocess.CalledProcessError as e:
        safe_err = e.stderr.replace(token, "***") if token else e.stderr
        logger.error(f"Failed to push branch '{branch_name}': {safe_err}")
        raise ValueError(f"Failed to push branch '{branch_name}' to remote: {safe_err}")


def generate_pr_content(
    task_description: str,
    completed_tasks: list[dict[str, Any]],
    failed_tasks: list[dict[str, Any]]
) -> tuple[str, str]:
    """
    Generates a structured Pull Request title and Markdown description.
    """
    title = f"feat: {task_description[:60]}" if len(task_description) <= 60 else f"feat: {task_description[:57]}..."

    completed_section = ""
    if completed_tasks:
        completed_section = "### ✅ Completed Subtasks\n"
        for t in completed_tasks:
            agent = t.get("agent", "agent")
            task_id = t.get("task_id", "")
            msg = t.get("message", "Completed successfully.")
            # Preview first 150 chars of agent output if multiline
            summary = msg.split("\n")[0] if msg else "Done"
            completed_section += f"- **[{agent.upper()}]** `Task {task_id}`: {summary}\n"
    else:
        completed_section = "### Completed Subtasks\n- *None*\n"

    failed_section = ""
    if failed_tasks:
        failed_section = "\n### ⚠️ Failed / Skipped Subtasks\n"
        for t in failed_tasks:
            agent = t.get("agent", "agent")
            task_id = t.get("task_id", "")
            err = t.get("message", "Failed")
            failed_section += f"- **[{agent.upper()}]** `Task {task_id}`: {err}\n"

    body = f"""## 🤖 Autonomous Software House Agent PR

### 📋 Task Overview
{task_description}

---

{completed_section}
{failed_section}

---
*Generated automatically by Software House Multi-Agent System.*
"""
    return title, body


async def create_pull_request(
    repo_url: str,
    branch_name: str,
    base_branch: str,
    title: str,
    description: str,
    token: str
) -> dict[str, Any]:
    """
    Calls the GitHub REST API to create a new Pull Request.
    """
    owner, repo = parse_repo_info(repo_url)
    client = github_client(token=token)

    payload = {
        "title": title,
        "body": description,
        "head": branch_name,
        "base": base_branch,
    }

    logger.info(f"Creating PR on {owner}/{repo}: head={branch_name} -> base={base_branch}")
    result = await client.post(f"repos/{owner}/{repo}/pulls", payload)

    if isinstance(result, dict) and "html_url" in result:
        logger.info(f"PR created successfully: {result['html_url']}")
        return result
    elif isinstance(result, dict) and "message" in result:
        logger.error(f"GitHub API Error creating PR: {result.get('message')} - {result.get('errors', '')}")
        raise ValueError(f"GitHub API Error: {result.get('message')} - {result.get('errors', '')}")

    return result


async def merge_pull_request(
    repo_url: str,
    pr_number: int,
    token: str,
    commit_title: str = "Merge pull request by autonomous agent",
) -> dict[str, Any]:
    """
    Calls the GitHub REST API to merge an open Pull Request into the base branch.
    """
    owner, repo = parse_repo_info(repo_url)
    client = github_client(token=token)

    payload = {
        "commit_title": commit_title,
        "merge_method": "merge",
    }

    logger.info(f"Merging PR #{pr_number} on {owner}/{repo} via GitHub REST API...")
    result = await client.put(f"repos/{owner}/{repo}/pulls/{pr_number}/merge", payload)

    if isinstance(result, dict) and result.get("merged") is True:
        logger.info(f"PR #{pr_number} successfully merged on GitHub: {result.get('message')}")
        return result
    elif isinstance(result, dict) and "message" in result:
        logger.warning(f"GitHub PR merge response: {result.get('message')}")
        return result

    return result

