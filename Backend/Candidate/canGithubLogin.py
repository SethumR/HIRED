import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GitHub OAuth constants
GITHUB_CLIENT_ID = "Ov23liujKfeX3V2GnVZs"  # Your GitHub client ID
GITHUB_CLIENT_SECRET = "f25e76d3327c9556209e2f6eb636a0889f28f32a"  # Your GitHub client secret
GITHUB_API_URL = "https://api.github.com/user"  # GitHub API to fetch user data

class GitHubAuthRequest(BaseModel):
    code: str

@app.post('/auth/github')
async def github_login(auth_request: GitHubAuthRequest):
    code = auth_request.code
    if not code:
        raise HTTPException(status_code=400, detail="Code is required")

    # Step 1: Exchange the code for an access token
    url = "https://github.com/login/oauth/access_token"
    params = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code,  # The code received from GitHub login response
    }
    headers = {
        'Accept': 'application/json'
    }

    # Step 2: Get access token from GitHub
    response = requests.post(url, data=params, headers=headers)
    data = response.json()

    if 'access_token' not in data:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    # Step 3: Use the access token to get user data
    access_token = data['access_token']
    user_response = requests.get(GITHUB_API_URL, headers={
        'Authorization': f'token {access_token}'
    })

    user_data = user_response.json()

    if user_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user data")

    # Step 4: Return user data (you can store user info in your DB if needed)
    return {
        "message": "Login successful",
        "user": {
            "name": user_data.get('name', 'No name'),
            "email": user_data.get('email', 'No email'),
            "avatar_url": user_data.get('avatar_url', 'No avatar URL'),
            "login": user_data.get('login', 'No login')
        }
    }
