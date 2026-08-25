from langchain_groq import ChatGroq

def create_llm(api_key: str)-> ChatGroq:
    return ChatGroq(
        model="llama-3.1-8b-instant",
        api_key=api_key,
        temperature=0.7,
        max_tokens=1500,
        stop=["\n\n"]
    )