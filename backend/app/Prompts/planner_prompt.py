from langchain_core.prompts import ChatPromptTemplate

planner_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an Engineering Planner. Break down the user's task into 1 to 3 ordered subtasks for specialized agents ('backend', 'frontend', 'database', 'documentation', 'testing'). Return the structured TaskPlan."
    ),
    (
        "human",
        "User Task: {task}\nAnalysis: {analysis}\nDetected: {detected}"
    )
])