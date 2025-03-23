import os
from fastapi import FastAPI, HTTPException, Depends
import httpx
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
import logging

# Load environment variables
load_dotenv()

# GitHub OAuth credentials
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_API_URL = "https://api.github.com/user"
GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token"

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware (allow your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection using Motor (async)
mongo_uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client["mydatabase"]
users_collection = db["users"]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic model for User
class User(BaseModel):
    username: str
    email: str
    github_id: str
    picture: str

# Function to check if the user already exists
async def user_exists(email: str) -> bool:
    user = await users_collection.find_one({"email": email})
    return user is not None

# Redirect user to GitHub OAuth page
@app.get("/auth/github")
async def github_login():
    github_oauth_url = f"{GITHUB_OAUTH_URL}?client_id={GITHUB_CLIENT_ID}&scope=user:email"
    return RedirectResponse(url=github_oauth_url)

# GitHub OAuth callback endpoint
@app.get("/auth/github/callback")
async def github_callback(code: str):
    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            GITHUB_ACCESS_TOKEN_URL,
            params={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="GitHub authentication failed")

        # Use the access token to fetch user info
        user_response = await client.get(
            GITHUB_API_URL, headers={"Authorization": f"Bearer {access_token}"}
        )
        user_data = user_response.json()
        
        # Extract user info
        user_email = user_data.get("email")
        github_id = user_data.get("id")
        username = user_data.get("login")
        picture = user_data.get("avatar_url")

        if not user_email:
            raise HTTPException(status_code=400, detail="No email found from GitHub")

        # Check if user already exists
        if await user_exists(user_email):
            raise HTTPException(status_code=400, detail="User already exists with this email")

        # Create a new user in the database
        new_user = {
            "username": username,
            "email": user_email,
            "github_id": github_id,
            "picture": picture,
        }
        await users_collection.insert_one(new_user)

        return {"message": "GitHub login successful", "user": new_user}

