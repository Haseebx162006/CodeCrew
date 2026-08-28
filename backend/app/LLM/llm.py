import os
from langchain_groq import ChatGroq

def create_llm(api_key: str, temperature: float = 0.2, max_tokens: int = 1500):
    """
    Creates and returns a Groq-powered Chat model instance with automatic fallback.
    Uses openai/gpt-oss-120b as primary with fallbacks to qwen/qwen3.6-27b.
    """
    primary_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    fallback_model = "qwen/qwen3.6-27b" if primary_model != "qwen/qwen3.6-27b" else "openai/gpt-oss-120b"

    primary_llm = ChatGroq(
        model=primary_model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    fallback_llm = ChatGroq(
        model=fallback_model,
        api_key=api_key,
        temperature=temperature,
        max_tokens=max_tokens,
    )

    return primary_llm.with_fallbacks([fallback_llm])