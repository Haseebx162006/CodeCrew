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


def get_agent(agent_name:str):
    agent_key= agent_name.lower().strip()
    if agent_key in AGENT_REGISTRY:
        return AGENT_REGISTRY[agent_key]
    else:
        raise ValueError(f"Agent '{agent_name}' not found in the registry.")


def route_subtask(
        # "this function takes a subtask and routes it to the appropriate agent for execution"
    subtask: SubTask,
    repo_path: str,
    context: Any = None,
    analysis: Any = None,
    detected: Any = None,
) -> dict:
    agent = get_agent(subtask.agent)
    return agent.execute(
        repo_path=repo_path,
        subtask=subtask,
        context=context,
        analysis=analysis,
        detected=detected,
    )




def execute_plan(state: ManagerState) -> ManagerState:



    # check if the plan is already a TaskPlan or a list of SubTask dictionaries
    raw_plan = state.get("plan")

    if isinstance(raw_plan,TaskPlan):
        subtasks: list[SubTask] = raw_plan.subtasks 
    elif isinstance(raw_plan,list):
        subtasks=[]

        for t in raw_plan:
            if isinstance(t,SubTask):
                subtasks.append(t)
            else:
                subtasks.append(SubTask(**t))



    # now am checking the completed and failed tasks

    

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
            # if one of the dependencies has failed, mark this task as blocked
            if any(dep in failed_ids for dep in t.depends_on):
                blocked.append(t)
            # if all dependencies are complete, mark this task as runnable
            elif all(dep in completed_ids for dep in t.depends_on):
                runnable.append(t)

        # done with blocked tasks, mark them as failed due to dependency failure
        for b_task in blocked:
            failed_tasks.append({
                "task_id": b_task.id,
                "status": "failed",
                "message": f"Dependency failed. Blocked by: {b_task.depends_on}",
                "agent": b_task.agent,
            })
            failed_ids.add(b_task.id)
            pending_tasks.remove(b_task)

        # Circular dependency ya unresolvable deadlock check
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
        # 4. Runnable tasks ko unke designated agent ke pas bhej kar execute karo
        for task in runnable:
            try:
                
                result = route_subtask(
                    subtask=task,
                    repo_path=state.get("repo_path", ""),
                    context=state.get("code_base_context"),
                    analysis=state.get("analyzed_codebase"),
                    detected=state.get("detected"),
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
    # 5. State update karke return karo
    state["completed_tasks"] = completed_tasks
    state["failed_tasks"] = failed_tasks
    return state


# Alias for backward compatibility
exexute_plan = execute_plan



    