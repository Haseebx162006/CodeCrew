from typing import TypedDict


class ManagerState(TypedDict):
    """
    Represents the state of a manager in the system.

  """
    task : str
    repo_path : str
    code_base_context : dict
    analyzed_codebase : dict
    detected : dict

    plan : list[dict]

    sub_tasks : dict | None

    completed_tasks : list[dict]

    failed_tasks : list[dict]

    pr_title : str | None

    pr_description : str | None

    

