import os
from langchain_groq import ChatGroq

def create_llm(api_key: str, temperature: float = 0.2, max_tokens: int = 4096):
    """
    Creates and returns a Groq-powered Chat model instance with automatic fallback.
    Primary: openai/gpt-oss-120b
    Fallbacks: openai/gpt-oss-20b, qwen/qwen3.8-27b
    """
    primary_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    fallback_model_1 = "openai/gpt-oss-20b"
    fallback_model_2 = "qwen/qwen3.8-27b"

    primary_llm = ChatGroq(
        model=primary_model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    fallback_1 = ChatGroq(
        model=fallback_model_1,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    fallback_2 = ChatGroq(
        model=fallback_model_2,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    return primary_llm.with_fallbacks([fallback_1, fallback_2])