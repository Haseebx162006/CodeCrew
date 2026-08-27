from typing import Annotated, Any, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


from Schema.schema import SubTask


class AgentState(TypedDict, total=False):
    messages: Annotated[list[BaseMessage], add_messages]
    repo_path: str
    subtask: SubTask
    context: dict[str, Any] | str | None
    analysis: dict[str, Any] | str | None
    detected: dict[str, Any] | str | None