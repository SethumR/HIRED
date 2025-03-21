import requests
import os
import logging
import datetime
import bcrypt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["mydatabase"]
companies_collection = db["companies"]

# GitHub OAuth constants
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "Ov23liujKfeX3V2GnVZs")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "f25e76d3327c9556209e2f6eb636a0889f28f32a")
GITHUB_API_URL = "https://api.github.com/user"

# Google OAuth client ID
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# =================== MODEL DEFINITIONS ===================

class GitHubAuthRequest(BaseModel):
    code: str

class GoogleTokenModel(BaseModel):
    token: str

class CompanySignupModel(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str = Field(min_length=2, max_length=100)
    industry: str = Field(min_length=2, max_length=50)
    website: str = ""
    logo: str = ""
    company_size: str = ""
    location: str = ""

class CompanyLoginModel(BaseModel):
    email: EmailStr
    password: str

# =================== HELPER FUNCTIONS ===================

async def hash_password(password: str) -> str:
    """Hash the password before storing in DB."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify the password against its hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# =================== GITHUB AUTH ===================

async def save_github_company_to_db(company_data):
    """Save or update GitHub company data to database."""
    existing_company = await companies_collection.find_one({"github_id": company_data["github_id"]})
    
    if existing_company:
        existing_company["_id"] = str(existing_company["_id"])
        return existing_company
    
    result = await companies_collection.insert_one(company_data)
    company_data["_id"] = str(result.inserted_id)
    return company_data

@app.post('/auth/company/github')
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
            'code': code,
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
            "account_type": "company",
            "created_at": user_data.get('created_at'),
            "updated_at": user_data.get('updated_at'),
            "auth_type": "github"
        }
        
        # Save company data to MongoDB
        saved_company = await save_github_company_to_db(company_data)

        return {
            "message": "Company login successful",
            "company": saved_company
        }

    except Exception as e:
        logger.error(f"Error during GitHub authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during GitHub authentication: {str(e)}")

# =================== GOOGLE AUTH ===================

async def save_google_company_to_db(company_data):
    """Save or update Google company data to database."""
    existing_company = await companies_collection.find_one({"google_id": company_data["google_id"]})
    
    if existing_company:
        existing_company["_id"] = str(existing_company["_id"])
        return existing_company
    
    result = await companies_collection.insert_one(company_data)
    company_data["_id"] = str(result.inserted_id)
    return company_data

@app.post("/auth/company/google")
async def google_company_auth(data: GoogleTokenModel):
    try:
        # Verify the Google token
        id_info = id_token.verify_oauth2_token(
            data.token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        # Check if this is a valid account
        if not id_info.get("email_verified", False):
            raise HTTPException(status_code=400, detail="Email not verified")

        # Extract company information
        company_data = {
            "google_id": id_info["sub"],
            "email": id_info["email"],
            "company_name": id_info.get("name", ""),
            "domain": id_info.get("hd", ""),
            "picture": id_info.get("picture", ""),
            "locale": id_info.get("locale", ""),
            "account_type": "company",
            "auth_type": "google"
        }

        # Save company data to MongoDB
        saved_company = await save_google_company_to_db(company_data)

        return {"message": "Company login successful", "company": saved_company}

    except ValueError as e:
        # Invalid token
        logger.error(f"Invalid token: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error during Google authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google authentication: {str(e)}")

# =================== MANUAL AUTH ===================

@app.post("/auth/company/signup")
async def company_signup(company: CompanySignupModel):
    """Register a new company account."""
    existing_company = await companies_collection.find_one({"email": company.email})
    if existing_company:
        raise HTTPException(status_code=400, detail="Email is already registered for a company account.")
    
    hashed_password = await hash_password(company.password)
    company_data = {
        "email": company.email,
        "password": hashed_password,
        "company_name": company.company_name,
        "industry": company.industry,
        "website": company.website,
        "logo": company.logo,
        "company_size": company.company_size,
        "location": company.location,
        "role": "company",
        "verified": False,
        "created_at": datetime.datetime.utcnow(),
        "auth_type": "manual"
    }
    
    new_company = await companies_collection.insert_one(company_data)
    company_data["_id"] = str(new_company.inserted_id)
    
    # Remove password from the response
    company_data.pop("password", None)
    
    return {"message": "Company signup successful", "company": company_data}

@app.post("/auth/company/login")
async def company_login(company_creds: CompanyLoginModel):
    """Log in a company with email and password."""
    company = await companies_collection.find_one({"email": company_creds.email})
    
    if not company:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if it's a manual auth account (has password)
    if "password" not in company:
        raise HTTPException(status_code=401, detail="This account uses social login. Please use the appropriate login method.")
        
    if not await verify_password(company_creds.password, company["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    company_data = dict(company)
    company_data["_id"] = str(company_data["_id"])
    company_data.pop("password", None)
    
    return {"message": "Login successful", "company": company_data}

# =================== PROFILE MANAGEMENT ===================

@app.get("/auth/company/profile/{company_id}")
async def get_company_profile(company_id: str):
    """Get company profile information."""
    try:
        company = await companies_collection.find_one({"_id": ObjectId(company_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company_data = dict(company)
    company_data["_id"] = str(company_data["_id"])
    company_data.pop("password", None)
    
    return company_data

@app.put("/auth/company/profile/{company_id}")
async def update_company_profile(company_id: str, update_data: dict):
    """Update company profile information."""
    try:
        company_obj_id = ObjectId(company_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    
    # Prevent updates to sensitive fields
    update_data.pop("password", None)
    update_data.pop("email", None)
    update_data.pop("role", None)
    update_data.pop("auth_type", None)
    update_data.pop("github_id", None)
    update_data.pop("google_id", None)
    
    result = await companies_collection.update_one(
        {"_id": company_obj_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Company not found")
    
    updated_company = await companies_collection.find_one({"_id": company_obj_id})
    company_data = dict(updated_company)
    company_data["_id"] = str(company_data["_id"])
    company_data.pop("password", None)
    
    return {"message": "Company profile updated successfully", "company": company_data}

# =================== SERVER STARTUP ===================

@app.on_event("startup")
async def startup_db():
    try:
        await client.server_info()
        logger.info("MongoDB connection established successfully.")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        raise HTTPException(status_code=500, detail="MongoDB connection failed")

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)