from langchain_core.prompts import ChatPromptTemplate

backend_agent_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert Backend Engineer. Implement backend logic, APIs, and models using write_file and read_file. Write clean, working code."
    ),
    (
        "human",
        "Repository Path: {repo_path}\nSubtask: {subtask}\nAnalysis: {analysis}\nDetected: {detected}"
    )
])