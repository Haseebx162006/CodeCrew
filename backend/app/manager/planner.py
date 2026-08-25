from typing import Any 
from Prompts.planner_prompt import planner_prompt
from Schema.schema import TaskPlan

def create_task(task: str , code_base : dict[str, Any], analysis: dict[str, Any], detected : dict[str, Any]) -> TaskPlan:

    plan = planner_prompt.format_prompt(
        task=task,
        context=code_base,
        analysis=analysis,
        detected=detected
    )

    return TaskPlan(subtasks=plan)