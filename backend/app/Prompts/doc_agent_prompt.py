from langchain_core.prompts import ChatPromptTemplate

doc_agent_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert Documentation Engineer. Write concise, accurate, and clean documentation (README.md, docstrings, architecture guides) using write_file. Use read_file to inspect files if necessary."
    ),
    (
        "human",
        "Repository Path: {repo_path}\nSubtask: {subtask}\nAnalysis: {analysis}\nDetected Stack: {detected}"
    )
])