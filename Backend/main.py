from fastapi import FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os
from bson import ObjectId
import logging
from fastapi.middleware.cors import CORSMiddleware

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
db = client["Contact"]
collection = db["users"]

# Define Pydantic model for request validation
class User(BaseModel):
    email: EmailStr  # Email validation
    message: str

# API Route to get all users
# API Route to create a new user
@app.post("/register")
async def register_user(user: User):
    # Insert into MongoDB without checking if user already exists
    user_data = user.dict()  # Convert model to dictionary with all fields
    try:
        result = await collection.insert_one(user_data)
        logger.info(f"User with email {user_data['email']} registered successfully with ID {result.inserted_id}.")
        return {"message": "User registered successfully", "user_id": str(result.inserted_id)}
    except Exception as e:
        logger.error(f"Error inserting user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error inserting user: {str(e)}")

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

@app.middleware("http")
async def add_mongo_id_to_json(request: Request, call_next):
    response = await call_next(request)
    if response.media_type == "application/json":
        response_body = b""
        async for chunk in response.body_iterator:
            response_body += chunk
        data = response_body.decode()
        # Check if '_id' exists and is an ObjectId
        if '_id' in data:
            data["_id"] = convert_objectid(data["_id"])  # Convert ObjectId to string
        response.body_iterator = iter([data.encode('utf-8')])  # Re-encode the modified body
    return response

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Make sure to allow external connections
