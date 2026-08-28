import httpx
from typing import Any

class github_client:
    base_url = "https://api.github.com"

    def __init__(self, token: str):
        self.token = token.strip() if token else ""

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }

    async def get(self, endpoint: str) -> Any:
        async with httpx.AsyncClient(timeout=15.0) as client:
            url = f"{self.base_url}/{endpoint.lstrip('/')}"
            response = await client.get(url, headers=self.headers)
            try:
                return response.json()
            except Exception:
                return {"status_code": response.status_code, "text": response.text}

    async def post(self, endpoint: str, data: dict) -> Any:
        async with httpx.AsyncClient(timeout=15.0) as client:
            url = f"{self.base_url}/{endpoint.lstrip('/')}"
            response = await client.post(url, headers=self.headers, json=data)
            try:
                return response.json()
            except Exception:
                return {"status_code": response.status_code, "text": response.text}

    async def put(self, endpoint: str, data: dict | None = None) -> Any:
        async with httpx.AsyncClient(timeout=15.0) as client:
            url = f"{self.base_url}/{endpoint.lstrip('/')}"
            response = await client.put(url, headers=self.headers, json=data or {})
            try:
                return response.json()
            except Exception:
                return {"status_code": response.status_code, "text": response.text}