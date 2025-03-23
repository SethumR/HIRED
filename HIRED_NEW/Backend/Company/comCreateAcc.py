from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
import os
import logging
import requests

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add CORS middleware (allow your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["Company"]  # Specify the database name
collection = db["users"]

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# GitHub OAuth constants
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "Ov23liujKfeX3V2GnVZs")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "f25e76d3327c9556209e2f6eb636a0889f28f32a")
GITHUB_API_URL = "https://api.github.com/user"

# Define Pydantic models
class CompanyModel(BaseModel):
    email: EmailStr         # Company email
    company_name: str       # Company name
    company_address: str    # Company address
    phone_number: str       # Contact number
    username: str           # Company username
    password: str           # Password
    reconfirm_password: str # Confirm password

class TokenModel(BaseModel):
    token: str

class GitHubAuthRequest(BaseModel):
    code: str

# Helper function to save company to the database
async def save_company_to_db(company_data):
    """Check if company already exists, if not, save to MongoDB."""
    existing_company = await collection.find_one({"email": company_data["email"]})
    if existing_company:
        logger.error("This company email is already registered.")
        raise HTTPException(status_code=400, detail="This company email is already registered.")
    
    await collection.insert_one(company_data)
    company_data["_id"] = str(company_data["_id"])  # Convert ObjectId to string
    return company_data

# Company registration route
@app.post("/auth/company/register")
async def register_company(data: CompanyModel):
    logger.info(f"Received company registration: {data.email}, {data.company_name}")

    if data.password != data.reconfirm_password:
        logger.error("Passwords do not match")
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Hash the password
    hashed_password = pwd_context.hash(data.password)

    company_data = {
        "email": data.email,
        "company_name": data.company_name,
        "company_address": data.company_address,
        "phone_number": data.phone_number,
        "username": data.username,
        "password": hashed_password,  # Store hashed password
        "role": "company"  # Mark user as a company
    }

    try:
        result = await save_company_to_db(company_data)
    except HTTPException as e:
        logger.error(f"Error: {e.detail}")
        raise

    logger.info(f"Company registration successful for {data.email}")
    return {"message": "Company registration successful", "company": result}

# Google OAuth route
@app.post("/companies/auth/google")
async def company_google_auth(data: TokenModel):
    """
    Authenticate companies using Google OAuth.
    If the company does not exist, it will be added to the database.
    """
    try:
        # Verify the Google token
        id_info = id_token.verify_oauth2_token(data.token, google_requests.Request(), os.getenv("GOOGLE_CLIENT_ID"))

        # Extract company information
        company_data = {
            "google_id": id_info["sub"],  # Unique Google ID
            "email": id_info["email"],
            "company_name": id_info.get("name", ""),
            "avatar_url": id_info.get("picture", ""),
            "role": "company"  # Mark user as a company
        }

        # Save company data to MongoDB
        await save_company_to_db(company_data)

        return {"message": "Company registration successful", "company": company_data}

    except Exception as e:
        logger.error(f"Error during Google authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google authentication: {str(e)}")

# GitHub OAuth route
@app.post("/companies/auth/github")
async def company_github_auth(auth_request: GitHubAuthRequest):
    """
    Authenticate companies using GitHub OAuth.
    If the company does not exist, they will be added to the database.
    """
    code = auth_request.code
    if not code:
        raise HTTPException(status_code=400, detail="Code is required")

    # Step 1: Exchange the code for an access token
    token_url = "https://github.com/login/oauth/access_token"
    params = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code,
    }
    headers = {'Accept': 'application/json'}
    
    response = requests.post(token_url, data=params, headers=headers)
    data = response.json()

    if 'access_token' not in data:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    # Step 2: Use the access token to get user data
    access_token = data['access_token']
    user_response = requests.get(GITHUB_API_URL, headers={
        'Authorization': f'token {access_token}'
    })

    user_data = user_response.json()

    if user_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user data")

    # Step 3: Construct company data
    company_data = {
        "github_id": user_data.get("id"),
        "company_name": user_data.get("name", user_data.get("login", "No Name")),
        "email": user_data.get("email", "No Email"),
        "avatar_url": user_data.get("avatar_url", "No Avatar"),
        "github_profile": user_data.get("html_url", "No Profile"),
        "role": "company"  # Distinguish from candidates
    }

    # Step 4: Store in MongoDB (if needed)
    await save_company_to_db(company_data)

    return {
        "message": "Company login successful",
        "company": company_data
    }

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)