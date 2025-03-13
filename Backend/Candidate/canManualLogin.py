from fastapi import FastAPI, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
import os
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
import logging

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
collection = db["users"]

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic model for signup validation
class SignupModel(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)  # Minimum password length of 6 characters
    name: str = Field(min_length=2, max_length=50)
    picture: str = ""  # Optional profile picture

async def hash_password(password: str) -> str:
    """Hash the password before storing in DB."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@app.post("/auth/signup/manual")
async def manual_signup(user: SignupModel):
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    hashed_password = await hash_password(user.password)
    user_data = {
        "email": user.email,
        "password": hashed_password,  # Store hashed password
        "name": user.name,
        "picture": user.picture,
    }
    
    new_user = await collection.insert_one(user_data)
    user_data["_id"] = str(new_user.inserted_id)
    
    return {"message": "Signup successful", "user": user_data}
