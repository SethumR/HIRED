from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google.auth.exceptions import GoogleAuthError
import os
from dotenv import load_dotenv
import logging
import requests

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace "*" with your frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["Candidate"]  # Specify the database name
collection = db["users"]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# GitHub OAuth constants
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")  # Your GitHub client ID
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")  # Your GitHub client secret
GITHUB_API_URL = "https://api.github.com/user"  # GitHub API to fetch user data

# Define Pydantic models for request validation
class CheckEmailModel(BaseModel):
    email: EmailStr  # Only the email field is required

class UserModel(BaseModel):
    email: EmailStr  # Ensures valid email format
    password: str

class GitHubAuthRequest(BaseModel):
    code: str

class TokenModel(BaseModel):
    token: str

# Helper function to save user to the database
async def save_user_to_db(user_data):
    # Check if user already exists by email
    existing_user = await collection.find_one({"email": user_data["email"]})
    if existing_user:
        logger.error("This email has already been registered.")
        raise HTTPException(status_code=400, detail="This email has already been registered.")

    # Insert user data into MongoDB
    result = await collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)  # Convert ObjectId to string
    return {"message": "User registered successfully", "user": user_data}

# Endpoint to check if email exists
@app.post("/auth/check-email")
async def check_email(user: CheckEmailModel):
    logger.info(f"Incoming request payload: {user}")  # Debugging: Log the payload
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")
    return {"exists": True}

# Endpoint for manual login
@app.post("/auth/signin")
async def signin_user(user: UserModel):
    # Check if email exists
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")

    # Return success response
    return {
        "message": "Login successful",
        "user": {
            "name": existing_user.get("name", "No name"),
            "email": existing_user.get("email", "No email"),
        }
    }

# Endpoint for GitHub login
@app.post("/auth/github")
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

    # Step 4: Check if the email exists in the database
    email = user_data.get('email')
    if not email:
        raise HTTPException(status_code=400, detail="Email not found in GitHub profile")

    existing_user = await collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found. Please sign up first.")

    # Step 5: Return user data
    return {
        "message": "Login successful",
        "user": {
            "name": user_data.get('name', 'No name'),
            "email": user_data.get('email', 'No email'),
            "avatar_url": user_data.get('avatar_url', 'No avatar URL'),
            "login": user_data.get('login', 'No login')
        }
    }

# Endpoint for Google login
@app.post("/auth/google")
async def google_auth(data: TokenModel):
    try:
        # Verify the Google token with a grace period for clock skew
        id_info = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID"),
            clock_skew_in_seconds=10  # Allow a 10-second clock skew
        )

        # Extract user information
        user_data = {
            "google_id": id_info["sub"],  # Use the 'sub' as unique Google ID
            "email": id_info["email"],
            "name": id_info.get("name", ""),
            "picture": id_info.get("picture", ""),
        }

        # Check if the email exists in the database
        existing_user = await collection.find_one({"email": user_data["email"]})
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found. Please sign up first.")

        # Return user data
        return {"message": "Login successful", "user": user_data}

    except GoogleAuthError as e:
        logger.error(f"GoogleAuthError: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid Google token.")
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error during Google authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google authentication: {str(e)}")

# Run FastAPI server (Only needed when you run it directly)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)