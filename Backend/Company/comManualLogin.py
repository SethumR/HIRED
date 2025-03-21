from fastapi import FastAPI, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
import os
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
import logging
import datetime  # Added missing import

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

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["mydatabase"]  # Specify the database name
companies_collection = db["companies"]  # Separate collection for companies

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic model for company signup validation
class CompanySignupModel(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)  # Increased minimum password length for companies
    company_name: str = Field(min_length=2, max_length=100)
    industry: str = Field(min_length=2, max_length=50)
    website: str = ""
    logo: str = ""  # Optional company logo
    company_size: str = ""  # Optional company size
    location: str = ""  # Optional company location

# Pydantic model for company login validation
class CompanyLoginModel(BaseModel):
    email: EmailStr
    password: str

async def hash_password(password: str) -> str:
    """Hash the password before storing in DB."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

async def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify the password against its hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

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
        "role": "company",  # Identify this account as a company
        "verified": False,  # Companies might need verification
        "created_at": datetime.datetime.utcnow()  # Fixed missing datetime import
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
    
    if not await verify_password(company_creds.password, company["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    company_data = dict(company)
    company_data["_id"] = str(company_data["_id"])  # Convert ObjectId to string
    company_data.pop("password", None)
    
    return {"message": "Login successful", "company": company_data}

@app.get("/auth/company/profile/{company_id}")
async def get_company_profile(company_id: str):
    """Get company profile information."""
    from bson.objectid import ObjectId
    
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
    from bson.objectid import ObjectId
    
    try:
        company_obj_id = ObjectId(company_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid company ID format")
    
    update_data.pop("password", None)
    update_data.pop("email", None)
    update_data.pop("role", None)
    
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