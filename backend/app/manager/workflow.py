from pathlib import Path
from typing import Any
from manager.state import ManagerState
from codeBase.clone import clone_repo, cleanup_workspace
from codeBase.analyzer import analyze_codebase
from codeBase.detector import detect_stack
from manager.planner import create_task
from manager.router import exexute_plan
from github.pr import commit_changes, push_branch, generate_pr_content, create_pull_request


async def run_workflow(
    repo_url: str,
    task_description: str,
    base_branch: str = "main",
    token: str | None = None,
) -> dict[str, Any]:
    """
    Executes the end-to-end autonomous agent workflow for a given repository task:
    1. Clones the repo & creates a feature branch.
    2. Analyzes the repository structure and detects tech stack.
    3. Generates a decomposed task plan with subtasks & dependencies.
    4. Routes and executes subtasks via specialized agents.
    5. Commits changes and pushes the feature branch to GitHub.
    6. Creates a GitHub Pull Request with a structured summary.
    7. Cleans up the temporary workspace.
    """
    repo_path: Path | None = None
    branch_name: str | None = None

    try:
        # Step 1: Clone repository & checkout feature branch
        clone_info = clone_repo(
            repo_url=repo_url,
            task_description=task_description,
            token=token,
        )
        repo_path = clone_info["repo_path"]
        branch_name = clone_info["branch_name"]

        # Step 2: Analyze codebase & detect technologies
        analyzed = analyze_codebase(repo_path)
        detected = detect_stack(repo_path)

        # Step 3: Plan subtasks using LLM Planner
        plan = create_task(
            task=task_description,
            code_base={},
            analysis=analyzed,
            detected=detected,
        )

        # Step 4: Initialize state & route subtasks to agents
        state: ManagerState = {
            "task": task_description,
            "repo_path": str(repo_path),
            "code_base_context": {},
            "analyzed_codebase": analyzed,
            "detected": detected,
            "plan": plan,
            "sub_tasks": None,
            "completed_tasks": [],
            "failed_tasks": [],
            "pr_title": None,
            "pr_description": None,
        }

        executed_state = exexute_plan(state)
        completed_tasks = executed_state.get("completed_tasks", [])
        failed_tasks = executed_state.get("failed_tasks", [])

        # Step 5: Commit changes
        commit_msg = f"feat: {task_description[:50]}"
        has_commits = commit_changes(repo_path, message=commit_msg)

        pr_url = None
        if has_commits:
            # Push the feature branch to origin
            push_branch(
                repo_path=repo_path,
                branch_name=branch_name,
                token=token,
                repo_url=repo_url,
            )

            # Step 6: Generate PR content and create GitHub Pull Request
            pr_title, pr_body = generate_pr_content(
                task_description=task_description,
                completed_tasks=completed_tasks,
                failed_tasks=failed_tasks,
            )

            if token:
                pr_response = await create_pull_request(
                    repo_url=repo_url,
                    branch_name=branch_name,
                    base_branch=base_branch,
                    title=pr_title,
                    description=pr_body,
                    token=token,
                )
                pr_url = pr_response.get("html_url")

        return {
            "status": "completed" if completed_tasks and not failed_tasks else "partially_completed" if completed_tasks else "failed",
            "repo_url": repo_url,
            "branch_name": branch_name,
            "pr_url": pr_url,
            "completed_tasks": completed_tasks,
            "failed_tasks": failed_tasks,
            "error": None,
        }

    except Exception as err:
        return {
            "status": "failed",
            "repo_url": repo_url,
            "branch_name": branch_name,
            "pr_url": None,
            "completed_tasks": [],
            "failed_tasks": [],
            "error": str(err),
        }

    finally:
        # Step 7: Always clean up temporary workspace
        if repo_path and repo_path.exists():
            cleanup_workspace(repo_path)