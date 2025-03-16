from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
import logging
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
db = client["mydatabase"]  # Specify the database name
companies_collection = db["companies"]  # Collection for company accounts

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Pydantic model for request validation
class TokenModel(BaseModel):
    token: str

async def save_company_to_db(company_data):
    # Check if company already exists
    existing_company = await companies_collection.find_one({"google_id": company_data["google_id"]})
    
    if existing_company:
        # Convert ObjectId to string
        existing_company["_id"] = str(existing_company["_id"])
        return existing_company
    
    # Insert company data into MongoDB
    result = await companies_collection.insert_one(company_data)
    company_data["_id"] = str(result.inserted_id)
    return company_data

@app.post("/company/auth/google")
async def google_company_auth(data: TokenModel):
    try:
        # Verify the Google token
        id_info = id_token.verify_oauth2_token(
            data.token, 
            google_requests.Request(), 
            os.getenv("GOOGLE_CLIENT_ID")
        )

        # Check if this is a valid account (you might want to validate email domains for companies)
        if not id_info.get("email_verified", False):
            raise HTTPException(status_code=400, detail="Email not verified")

        # Extract company information
        company_data = {
            "google_id": id_info["sub"],  # Use the 'sub' as unique Google ID
            "email": id_info["email"],
            "company_name": id_info.get("name", ""),
            "domain": id_info.get("hd", ""),  # G Suite domain if available
            "picture": id_info.get("picture", ""),
            "locale": id_info.get("locale", ""),
            "account_type": "company",  # Differentiate from candidate accounts
        }

        # Save company data to MongoDB
        saved_company = await save_company_to_db(company_data)

        return {"message": "Company login successful", "company": saved_company}

    except ValueError as e:
        # Invalid token
        logger.error(f"Invalid token: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error during Google authentication: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google authentication: {str(e)}")

# Helper function to convert ObjectId to string for response
def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

@app.on_event("startup")
async def startup_db():
    try:
        await client.server_info()  # Will raise an exception if unable to connect
        logger.info("MongoDB connection established successfully.")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        raise HTTPException(status_code=500, detail="MongoDB connection failed")

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Using different port than candidate login