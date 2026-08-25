import os

from load_dotenv import load_dotenv
load_dotenv()

from pydantic import BaseSettings
class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
settings = Settings()
