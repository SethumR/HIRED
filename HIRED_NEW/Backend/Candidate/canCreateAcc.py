import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
import os
import logging
from passlib.context import CryptContext
from bson import ObjectId

# Load environment variables  
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware (allow your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB (using Motor for async support)
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["Candidate"]  # Specify the database name
collection = db["users"]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# GitHub OAuth constants
GITHUB_CLIENT_ID = "Ov23liujKfeX3V2GnVZs"  # Your GitHub client ID
GITHUB_CLIENT_SECRET = "f25e76d3327c9556209e2f6eb636a0889f28f32a"  # Your GitHub client secret
GITHUB_API_URL = "https://api.github.com/user"  # GitHub API to fetch user data

# Define Pydantic models for request validation
class GitHubAuthRequest(BaseModel):
    code: str

class TokenModel(BaseModel):
    token: str

class UserModel(BaseModel):
    email: EmailStr  # Ensures valid email format
    lastname: str
    phone_number: str
    username: str
    password: str
    reconfirm_password: str

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


@app.post("/auth/google")
async def google_auth(data: TokenModel):
    try:
        # Verify the Google token
        id_info = id_token.verify_oauth2_token(data.token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))

        # Extract user information
        user_data = {
            "google_id": id_info["sub"],  # Use the 'sub' as unique Google ID
            "email": id_info["email"],
            "name": id_info.get("name", ""),
            "picture": id_info.get("picture", ""),
        }

        # Save user data to MongoDB
        result = await save_user_to_db(user_data)

        if result["message"] == "This email has already been registered.":
            raise HTTPException(status_code=400, detail=result["message"])

        # Convert ObjectId to string
        user_data["_id"] = str(user_data["_id"]) if "_id" in user_data else None

        return {"message": "Login successful", "user": user_data}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error during Google authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google authentication: {str(e)}")



@app.post("/auth/register")
async def register_user(data: UserModel):
    logger.info(f"Received registration data: {data.email}, {data.username}")

    if data.password != data.reconfirm_password:
        logger.error("Passwords do not match")
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if email is already used
    existing_user = await collection.find_one({"email": data.email})
    if existing_user:
        logger.error("Email is already registered")
        raise HTTPException(status_code=400, detail="Email is already registered")

    user_data = {
        "email": data.email,
        "lastname": data.lastname,
        "phone_number": data.phone_number,
        "username": data.username,
        "password": data.password,
    }

    try:
        result = await save_user_to_db(user_data)
    except HTTPException as e:
        logger.error(f"Error: {e.detail}")
        raise

    logger.info(f"Registration successful for {data.email}")
    return {"message": "Registration successful", "user": result["user"]}

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)