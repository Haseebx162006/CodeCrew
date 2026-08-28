from langchain_core.prompts import ChatPromptTemplate

database_agent_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert Database Engineer. Design schemas, migrations, and database access logic using write_file and read_file."
    ),
    (
        "human",
        "Repository Path: {repo_path}\nSubtask: {subtask}\nAnalysis: {analysis}\nDetected: {detected}"
    )
])