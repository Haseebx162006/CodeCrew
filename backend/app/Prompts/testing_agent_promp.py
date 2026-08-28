from langchain_core.prompts import ChatPromptTemplate

testing_agent_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert QA and Testing Engineer. Write tests, unit tests, and validation scripts using write_file and read_file."
    ),
    (
        "human",
        "Repository Path: {repo_path}\nSubtask: {subtask}\nAnalysis: {analysis}\nDetected: {detected}"
    )
])