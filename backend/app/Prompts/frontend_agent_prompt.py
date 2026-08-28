from langchain_core.prompts import ChatPromptTemplate

frontend_agent_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert Frontend Engineer. Implement UI components, styles, and state management using write_file and read_file."
    ),
    (
        "human",
        "Repository Path: {repo_path}\nSubtask: {subtask}\nAnalysis: {analysis}\nDetected: {detected}"
    )
])