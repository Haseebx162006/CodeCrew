from LLM.llm import create_llm
from settings.config import settings
from Prompts.testing_agent_promp   import testing_agent_prompt
from Schema.schema import SubTask
from Tools.tools import run_tests, read_file, write_file, search_code


tools = [
    run_tests,
    read_file,
    write_file,
    search_code

]


class testing_agent:

    def __init__(self):
        self.llm = create_llm(
            settings.GROQ_API_KEY
        )

        self.llm_with_tools = self.llm.bind_tools(
            tools
        )

        self.prompt = testing_agent_prompt

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


testing_agent = testing_agent()
