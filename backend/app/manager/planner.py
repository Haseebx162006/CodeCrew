import logging
from typing import Any
from LLM.llm import create_llm
from settings.config import settings
from Prompts.planner_prompt import planner_prompt
from Schema.schema import TaskPlan, SubTask

logger = logging.getLogger(__name__)


def create_task(
    task: str,
    code_base: dict[str, Any],
    analysis: dict[str, Any],
    detected: dict[str, Any]
) -> TaskPlan:
    """Invokes LLM with structured output to break task into ordered subtasks."""
    try:
        llm = create_llm(settings.get_groq_key("planner"))
        structured_llm = llm.with_structured_output(TaskPlan)
        chain = planner_prompt | structured_llm

        plan = chain.invoke({
            "task": task,
            "analysis": str(analysis)[:400] if analysis else "None",
            "detected": str(detected)[:300] if detected else "None",
        })
        if isinstance(plan, TaskPlan) and plan.subtasks:
            return plan
        if isinstance(plan, dict) and "subtasks" in plan:
            return TaskPlan.model_validate(plan)
    except Exception as err:
        logger.warning(f"Planner structured output fallback: {err}")

    # Fallback to smart agent based on task keywords
    task_lower = (task or "").lower()
    if any(k in task_lower for k in ["readme", "doc", "explain", "guide", "markdown"]):
        agent_type = "docs"
    elif any(k in task_lower for k in ["test", "pytest", "spec", "qa"]):
        agent_type = "testing"
    elif any(k in task_lower for k in ["db", "database", "schema", "table", "sql", "migration"]):
        agent_type = "database"
    elif any(k in task_lower for k in ["ui", "frontend", "css", "html", "react", "page", "button", "modal"]):
        agent_type = "frontend"
    else:
        agent_type = "backend"

    return TaskPlan(
        subtasks=[
            SubTask(
                id="task_1",
                description=task,
                agent=agent_type,
                depends_on=[],
            )
        ]
    )