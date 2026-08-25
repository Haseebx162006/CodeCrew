import httpx
class github_client:
    base_url = "https://api.github.com"
    def __init__(self,token:str):
        self.token = token 

    @property
    def headers(self): 
        return { "Authorization": f"Bearer {self.token}", "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", }

    async def get(self, endpoint:str):

        client = httpx.AsyncClient()

        url = f"{self.base_url}/{endpoint}"

        response = await client.get(url, headers=self.headers)

        return response.json()
    

    async def post(self, endpoint:str, data:dict):

        client = httpx.AsyncClient()

        url = f"{self.base_url}/{endpoint}"

        response = await  client.post(url, headers=self.headers, json=data)

        return response.json()


    