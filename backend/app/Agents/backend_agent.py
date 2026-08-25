from LLM.llm import create_llm
from settings.config import settings
from Prompts.backend_agent_prompt import backend_agent_prompt
from Schema.schema import SubTask
from Tools.tools import read_file, write_file, search_code


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

        self.prompt = backend_agent_prompt

    def execute(
        self,
        repo_path: str,
        subtask: SubTask,
        context: str,
        analysis: str,
        detected: str
    ):

        chain = self.prompt | self.llm_with_tools

        response = chain.invoke({
            "repo_path": repo_path,
            "subtask": subtask.description,
            "context": context,
            "analysis": analysis,
            "detected": detected
        })

        return {
            "task_id": subtask.id,
            "status": "completed",
            "message": response.content,
            "tool_calls": response.tool_calls
        }


backend_agent = BackendAgent()