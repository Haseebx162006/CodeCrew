from typing import Any
from Schema.schema import SubTask, TaskPlan
from manager.state import ManagerState
from Agents.backend_agent import backend_agent
from Agents.database_agent import database_agent
from Agents.frontend_agent import frontend_agent
from Agents.testing_agent import testing_agent
from Agents.docs_agent import docs_agent

AGENT_REGISTRY = {
    "backend": backend_agent,
    "database": database_agent,
    "frontend": frontend_agent,
    "testing": testing_agent,
    "docs": docs_agent,
    "documentation": docs_agent,
}


def get_agent(agent_name: str):
    agent_key = (agent_name or "").lower().strip()
    if agent_key in AGENT_REGISTRY:
        return AGENT_REGISTRY[agent_key]
    if "doc" in agent_key or "readme" in agent_key:
        return AGENT_REGISTRY["docs"]
    if "front" in agent_key or "ui" in agent_key or "react" in agent_key:
        return AGENT_REGISTRY["frontend"]
    if "data" in agent_key or "db" in agent_key or "sql" in agent_key:
        return AGENT_REGISTRY["database"]
    if "test" in agent_key or "qa" in agent_key:
        return AGENT_REGISTRY["testing"]
    return AGENT_REGISTRY["backend"]


def route_subtask(
    subtask: SubTask,
    repo_path: str,
    context: Any = None,
    analysis: Any = None,
    detected: Any = None,
    session_id: str | None = None,
) -> dict:
    """Routes a subtask to the appropriate agent for execution with session memory."""
    agent = get_agent(subtask.agent)
    return agent.execute(
        repo_path=repo_path,
        subtask=subtask,
        context=context,
        analysis=analysis,
        detected=detected,
        session_id=session_id,
    )


def execute_plan(state: ManagerState, session_id: str | None = None) -> ManagerState:
    """
    Executes subtasks in topological order while resolving dependencies.
    """
    raw_plan = state.get("plan")

    subtasks: list[SubTask] = []
    if isinstance(raw_plan, TaskPlan):
        subtasks = [t for t in raw_plan.subtasks if isinstance(t, SubTask)]
    elif isinstance(raw_plan, dict) and "subtasks" in raw_plan:
        for t in raw_plan["subtasks"]:
            if isinstance(t, SubTask):
                subtasks.append(t)
            elif isinstance(t, dict):
                try:
                    subtasks.append(SubTask(**t))
                except Exception:
                    pass
    elif isinstance(raw_plan, list):
        for t in raw_plan:
            if isinstance(t, SubTask):
                subtasks.append(t)
            elif isinstance(t, dict):
                try:
                    subtasks.append(SubTask(**t))
                except Exception:
                    pass

    if not subtasks:
        subtasks = [
            SubTask(
                id="task_1",
                description=state.get("task") or "Implement task requirements",
                agent="docs" if any(w in (state.get("task") or "").lower() for w in ["doc", "readme", "explain"]) else "backend",
                depends_on=[],
            )
        ]


    completed_tasks: list[dict] = list(state.get("completed_tasks", []))
    failed_tasks: list[dict] = list(state.get("failed_tasks", []))
    completed_ids: set[str] = {t["task_id"] for t in completed_tasks if "task_id" in t}
    failed_ids: set[str] = {t["task_id"] for t in failed_tasks if "task_id" in t}

    pending_tasks: list[SubTask] = [
        t for t in subtasks if t.id not in completed_ids and t.id not in failed_ids
    ]

    while pending_tasks:
        runnable: list[SubTask] = []
        blocked: list[SubTask] = []
        for t in pending_tasks:
            if any(dep in failed_ids for dep in t.depends_on):
                blocked.append(t)
            elif all(dep in completed_ids for dep in t.depends_on):
                runnable.append(t)

        for b_task in blocked:
            failed_tasks.append({
                "task_id": b_task.id,
                "status": "failed",
                "message": f"Dependency failed. Blocked by: {b_task.depends_on}",
                "agent": b_task.agent,
            })
            failed_ids.add(b_task.id)
            pending_tasks.remove(b_task)

        if not runnable and pending_tasks:
            for rem in pending_tasks:
                failed_tasks.append({
                    "task_id": rem.id,
                    "status": "failed",
                    "message": "Unresolvable dependency loop.",
                    "agent": rem.agent,
                })
                failed_ids.add(rem.id)
            break

        for task in runnable:
            try:
                result = route_subtask(
                    subtask=task,
                    repo_path=state.get("repo_path", ""),
                    context=state.get("code_base_context"),
                    analysis=state.get("analyzed_codebase"),
                    detected=state.get("detected"),
                    session_id=session_id,
                )
                if result.get("status") == "completed":
                    completed_tasks.append(result)
                    completed_ids.add(task.id)
                else:
                    failed_tasks.append(result)
                    failed_ids.add(task.id)
            except Exception as err:
                failed_tasks.append({
                    "task_id": task.id,
                    "status": "failed",
                    "message": str(err),
                    "agent": task.agent,
                })
                failed_ids.add(task.id)
            pending_tasks.remove(task)

    state["completed_tasks"] = completed_tasks
    state["failed_tasks"] = failed_tasks
    return state


# Alias for backward compatibility
exexute_plan = execute_plan