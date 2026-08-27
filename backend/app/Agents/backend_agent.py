from typing import Any
from LLM.llm import create_llm
from settings.config import settings
from Prompts.backend_agent_prompt import backend_agent_prompt
from Schema.schema import SubTask
from Tools.tools import read_file, write_file, search_code
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph import StateGraph, START, END

try:
    from Agents.agent_state import AgentState
except ImportError:
    from agent_state import AgentState

tools = [
    read_file,
    write_file,
    search_code
]


class BackendAgent:

    def __init__(self):
        self.llm = create_llm(
            settings.GROQ_API_KEY
        )

        self.llm_with_tools = self.llm.bind_tools(
            tools
        )
        self.tool_node = ToolNode(
            tools=tools
        )
        self.prompt = backend_agent_prompt
        self.graph = self.build_graph()

    def call_llm(self, state: AgentState):
        response = self.llm_with_tools.invoke(
            state["messages"]
        )

        return {
            "messages": [response]
        }

    def build_graph(self):
        graph = StateGraph(AgentState)

        graph.add_node("llm", self.call_llm)
        graph.add_node("tools", self.tool_node)
        graph.add_edge(START, "llm")
        
        graph.add_conditional_edges(
            "llm",
            tools_condition,
            {
                "tools": "tools",
                END: END
            }
        )
        graph.add_edge("tools", "llm")
        return graph.compile()

    def execute(
        self,
        repo_path: str,
        subtask: SubTask,
        context: dict[str, Any] | str | None = None,
        analysis: dict[str, Any] | str | None = None,
        detected: dict[str, Any] | str | None = None
    ) -> dict:
        prompt_messages = self.prompt.format_messages(
            repo_path=repo_path,
            subtask=subtask.description,
            context=context,
            analysis=analysis,
            detected=detected
        )

        initial_state: AgentState = {
            "messages": prompt_messages,
            "repo_path": repo_path,
            "subtask": subtask,
            "context": context,
            "analysis": analysis,
            "detected": detected
        }

        result = self.graph.invoke(initial_state)
        last_message = result["messages"][-1] if result.get("messages") else None

        return {
            "task_id": subtask.id,
            "status": "completed",
            "message": last_message.content if last_message else "",
            "messages": result.get("messages", [])
        }


backend_agent = BackendAgent()