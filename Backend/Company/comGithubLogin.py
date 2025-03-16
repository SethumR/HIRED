import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to MongoDB (using Motor for async support)
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["mydatabase"]  # Specify the database name
companies_collection = db["companies"]  # Collection for company accounts

# GitHub OAuth constants
GITHUB_CLIENT_ID = "Ov23liujKfeX3V2GnVZs"  # Your GitHub client ID
GITHUB_CLIENT_SECRET = "f25e76d3327c9556209e2f6eb636a0889f28f32a"  # Your GitHub client secret
GITHUB_API_URL = "https://api.github.com/user"  # GitHub API to fetch user data

class GitHubAuthRequest(BaseModel):
    code: str

async def save_company_to_db(company_data):
    # Check if company already exists
    existing_company = await companies_collection.find_one({"github_id": company_data["github_id"]})
    
    if existing_company:
        # Return the existing company data
        return existing_company
    
    # Insert company data into MongoDB
    result = await companies_collection.insert_one(company_data)
    company_data["_id"] = str(result.inserted_id)
    return company_data

@app.post('/company/auth/github')
async def github_company_login(auth_request: GitHubAuthRequest):
    code = auth_request.code
    if not code:
        raise HTTPException(status_code=400, detail="Code is required")

    try:
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
            logger.error(f"Failed to get access token: {data}")
            raise HTTPException(status_code=400, detail="Failed to get access token")

        # Step 3: Use the access token to get user data
        access_token = data['access_token']
        user_response = requests.get(GITHUB_API_URL, headers={
            'Authorization': f'token {access_token}'
        })

        user_data = user_response.json()

        if user_response.status_code != 200:
            logger.error(f"Failed to fetch user data: {user_data}")
            raise HTTPException(status_code=400, detail="Failed to fetch user data")

        # Step 4: Process company data and save to database
        company_data = {
            "github_id": user_data.get('id'),
            "company_name": user_data.get('name', 'No name'),
            "email": user_data.get('email', 'No email'),
            "avatar_url": user_data.get('avatar_url', 'No avatar URL'),
            "login": user_data.get('login', 'No login'),
            "company": user_data.get('company', None),
            "location": user_data.get('location', None),
            "bio": user_data.get('bio', None),
            "account_type": "company",  # Differentiate from candidate accounts
            "created_at": user_data.get('created_at'),
            "updated_at": user_data.get('updated_at'),
        }
        
        # Save company data to MongoDB
        saved_company = await save_company_to_db(company_data)

        return {
            "message": "Company login successful",
            "company": saved_company
        }

    except Exception as e:
        logger.error(f"Error during GitHub authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during GitHub authentication: {str(e)}")

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)