from fastapi import FastAPI, APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Initialize router for Google authentication
google_router = APIRouter()

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://Hired:hired123@hired.pni4x.mongodb.net/?retryWrites=true&w=majority&appName=Hired")
client = AsyncIOMotorClient(mongo_uri)
db = client["Company"]  # Specify the database name
collection = db["users"]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Pydantic model for request validation
class GoogleTokenModel(BaseModel):
    token: str

async def save_user_to_db(user_data):
    existing_user = await collection.find_one({"google_id": user_data["google_id"]})
    if existing_user:
        return existing_user  # Return existing user if already signed up
    
    new_user = await collection.insert_one(user_data)
    user_data["_id"] = str(new_user.inserted_id)
    return user_data

@google_router.post("/auth/signup/google")
async def google_signup(data: GoogleTokenModel):
    try:
        # Log the received token for debugging
        logger.info(f"Received token: {data.token}")
        
        # Verify Google token
        try:
            # Ensure the token is in a valid format
            parts = data.token.split('.')
            if len(parts) != 3:
                logger.error(f"Token is not in the expected JWT format: {data.token}")
                raise ValueError("Token is not in the expected JWT format.")
            
            google_client_id = os.getenv("GOOGLE_CLIENT_ID")
            id_info = id_token.verify_oauth2_token(data.token, google_requests.Request(), google_client_id)
            
            # Log decoded token information
            logger.info(f"Decoded token info: {id_info}")
        except ValueError as e:
            logger.error(f"Invalid token: {e}")
            raise HTTPException(status_code=400, detail="Invalid Google token. Please provide a valid token.")
        
        # Extract user information
        user_data = {
            "google_id": id_info["sub"],
            "email": id_info["email"],
            "name": id_info.get("name", ""),
            "picture": id_info.get("picture", ""),
        }
        
        # Save user data to MongoDB
        user = await save_user_to_db(user_data)
        
        return {"message": "Google signup successful", "user": user}
    
    except Exception as e:
        logger.error(f"Error during Google signup: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during Google signup: {str(e)}")

# Include the google authentication router
app.include_router(google_router)
