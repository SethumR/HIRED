import os
import json
import uuid
from datetime import datetime
from typing import Dict, List

import logging
from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import fitz  # PyMuPDF
import docx
from io import BytesIO
import requests

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware (allow your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a dictionary to store uploaded CVs
uploaded_cvs = {}

# OpenAI API Key (Store securely in an env variable)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Make sure to set this in your .env file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Verify if the API key is loaded correctly
if not OPENAI_API_KEY:
    logger.error("OpenAI API key is not set. Please check your .env file.")
else:
    logger.info("OpenAI API key loaded successfully.")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file_bytes):
    doc = fitz.open(stream=pdf_file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

# Function to extract text from DOCX
def extract_text_from_docx(docx_file_bytes):
    doc = docx.Document(BytesIO(docx_file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

# Function to generate interview questions using OpenAI based on CV content
def generate_interview_questions(cv_text):
    prompt = f"""
    Based on the following CV, generate 5 technical interview questions related to the candidate's experience and skills:
    
    CV Text:
    {cv_text}
    
    Format the questions as:
    Q1: [Question]
    Q2: [Question]
    Q3: [Question]
    Q4: [Question]
    Q5: [Question]
    """

    # Make the API request to OpenAI to generate questions
    response = openai.Completion.create(
        model="gpt-4",
        prompt=prompt,
        max_tokens=300,
        temperature=0.7,
        n=1,
        stop=["\n"]
    )
    
    if response.status_code == 200:
        generated_questions = response.choices[0].text.strip()
        logger.info(f"Generated Questions: {generated_questions}")
        return generated_questions
    else:
        logger.error(f"OpenAI API error: {response.status_code}, {response.text}")
        raise Exception(f"OpenAI API error: {response.status_code}, {response.text}")

# API Endpoint for CV Upload and Question Generation
@app.post("/generate_interview_questions/")
async def generate_interview_questions_endpoint(file: UploadFile = File(...)):
    file_extension = file.filename.split(".")[-1].lower()

    try:
        file_content = await file.read()  # Read the uploaded file content

        # Process based on file type
        if file_extension == "pdf":
            text = extract_text_from_pdf(file_content)
        elif file_extension == "docx":
            text = extract_text_from_docx(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")

        # Generate interview questions using the extracted CV text
        questions = generate_interview_questions(text)
        return {"questions": questions}

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# API Endpoint for generating interview questions from text input
@app.post("/generate_interview_questions_from_text/")
async def generate_interview_questions_from_text(cv_text: str):
    try:
        questions = generate_interview_questions(cv_text)
        return {"questions": questions}
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Add response model
class UploadResponse(BaseModel):
    message: str
    cv_id: str
    filename: str
    size: str

@app.post("/upload", response_model=UploadResponse)
async def upload_cv(file: UploadFile = File(...)) -> UploadResponse:
    """
    Upload a CV file and store it for later use.
    """
    try:
        logger.info(f"Received file upload request: {file.filename}")
        
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")
            
        # Validate file size (5MB limit)
        file_size = 0
        content = await file.read()
        file_size = len(content)
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(status_code=400, detail="File size too large. Maximum size is 5MB")
            
        # Reset file pointer
        await file.seek(0)
            
        # Validate file extension
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["pdf", "doc", "docx"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid file format. Only PDF, DOC, and DOCX files are supported."
            )

        # Validate content type
        content_type = file.content_type
        valid_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        if content_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid content type: {content_type}. Must be PDF or Word document."
            )

        # Generate a unique ID for the CV
        cv_id = str(uuid.uuid4())

        # Store the CV content and metadata
        uploaded_cvs[cv_id] = {
            "filename": file.filename,
            "content": content,
            "content_type": content_type,
            "extension": file_extension,
            "size": str(file_size),
            "upload_time": datetime.now().isoformat()
        }

        # Format file size for display
        formatted_size = f"{file_size / 1024:.2f} KB" if file_size < 1024 * 1024 else f"{file_size / (1024 * 1024):.2f} MB"

        logger.info(f"Successfully uploaded CV: {file.filename} (ID: {cv_id})")
        return UploadResponse(
            message="CV uploaded successfully",
            cv_id=cv_id,
            filename=file.filename,
            size=formatted_size
        )

    except HTTPException as e:
        logger.error(f"HTTP Exception during upload: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload CV: {str(e)}"
        )

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)
