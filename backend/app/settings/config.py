from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./software_house.db"
    GROQ_API_KEY: str = ""
    GROQ_API_KEY_PLANNER: str = ""
    GROQ_API_KEY_BACKEND: str = ""
    GROQ_API_KEY_FRONTEND: str = ""
    GROQ_API_KEY_DATABASE: str = ""
    GROQ_API_KEY_DOCS: str = ""
    GROQ_API_KEY_TESTING: str = ""
    GITHUB_APP_ID: str = ""
    GITHUB_PRIVATE_KEY: str = ""
    GITHUB_PRIVATE_KEY_PATH: str = ""
    ClientID: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_TOKEN: str = ""
    GITHUB_PAT: str = ""
    # LangSmith Tracing & Observability
    LANGSMITH_TRACING: str = "true"
    LANGCHAIN_TRACING_V2: str = "true"
    LANGSMITH_API_KEY: str = ""
    LANGSMITH_PROJECT: str = "software-house-agent"
    LANGSMITH_ENDPOINT: str = "https://api.smith.langchain.com"

    def get_groq_key(self, agent_name: str = "default") -> str:
        """Returns the specific Groq API key for an agent, falling back to GROQ_API_KEY."""
        name = agent_name.lower().strip()
        key_map = {
            "planner": self.GROQ_API_KEY_PLANNER,
            "backend": self.GROQ_API_KEY_BACKEND,
            "frontend": self.GROQ_API_KEY_FRONTEND,
            "database": self.GROQ_API_KEY_DATABASE,
            "docs": self.GROQ_API_KEY_DOCS,
            "documentation": self.GROQ_API_KEY_DOCS,
            "testing": self.GROQ_API_KEY_TESTING,
        }
        specific_key = key_map.get(name, "")
        if specific_key and specific_key.strip():
            return specific_key.strip()
        return self.GROQ_API_KEY.strip() if self.GROQ_API_KEY else ""


    model_config = SettingsConfigDict(
        env_file=[
            BASE_DIR / ".env",
            Path(".env"),
            Path("../.env"),
        ],
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def github_client_id(self) -> str:
        """Returns GitHub OAuth / App Client ID stripped of whitespace."""
        cid = self.GITHUB_CLIENT_ID or self.ClientID
        return cid.strip() if cid else ""

    @property
    def resolved_github_token(self) -> str:
        """Returns GitHub access token or personal access token (PAT) from env vars."""
        tok = self.GITHUB_TOKEN or self.GITHUB_PAT
        return tok.strip() if tok else ""


    @property
    def private_key(self) -> str:
        """Returns private key from env var or auto-reads from .pem file in backend folder."""
        if self.GITHUB_PRIVATE_KEY:
            return self.GITHUB_PRIVATE_KEY.replace("\\n", "\n")
        if self.GITHUB_PRIVATE_KEY_PATH:
            p = Path(self.GITHUB_PRIVATE_KEY_PATH)
            if not p.is_absolute():
                p = BASE_DIR / p
            if p.exists():
                return p.read_text(encoding="utf-8")
        # Auto-detect any .pem file in backend directory
        pem_files = list(BASE_DIR.glob("*.pem"))
        if pem_files:
            return pem_files[0].read_text(encoding="utf-8")
        return ""

    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL.strip() if self.DATABASE_URL else ""
        if not url:
            return "sqlite+aiosqlite:///./software_house.db"
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("sqlite://") and not url.startswith("sqlite+"):
            return url.replace("sqlite://", "sqlite+aiosqlite://", 1)

        if "postgresql+asyncpg://" in url:
            import urllib.parse
            parsed = urllib.parse.urlparse(url)
            query_params = urllib.parse.parse_qs(parsed.query)
            clean_params = {}
            for k, v in query_params.items():
                if k == "sslmode":
                    clean_params["ssl"] = v[0]
                elif k == "channel_binding":
                    continue
                else:
                    clean_params[k] = v[0]
            new_query = urllib.parse.urlencode(clean_params)
            url = urllib.parse.urlunparse(parsed._replace(query=new_query))

        return url


settings = Settings()

# Automatically sync LangSmith environment variables if API key is provided
if settings.LANGSMITH_API_KEY and settings.LANGSMITH_API_KEY.strip():
    import os
    os.environ["LANGSMITH_TRACING"] = str(settings.LANGSMITH_TRACING).lower()
    os.environ["LANGCHAIN_TRACING_V2"] = str(settings.LANGCHAIN_TRACING_V2).lower()
    os.environ["LANGSMITH_API_KEY"] = settings.LANGSMITH_API_KEY.strip()
    os.environ["LANGSMITH_PROJECT"] = settings.LANGSMITH_PROJECT.strip()
    os.environ["LANGSMITH_ENDPOINT"] = settings.LANGSMITH_ENDPOINT.strip()
