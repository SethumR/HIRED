from fastapi import FastAPI, File, UploadFile, HTTPException
import fitz  # PyMuPDF
import docx
import requests
import os
from io import BytesIO
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware (allow your frontend domain)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your actual frontend do main
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Hugging Face API Key (Store securely in an env variable)
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  # Make sure to set this in your .env file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Verify if the API key is loaded correctly
if not HUGGINGFACE_API_KEY:
    logger.error("Hugging Face API key is not set. Please check your .env file.")
else:
    logger.info("Hugging Face API key loaded successfully.")

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

# Function to generate script using Hugging Face API
def generate_script(cv_text):
    prompt = f"""
    Analyze the following CV text and generate:
    1. A personalized self-introduction.
    2. A normal introduction.
    3. Overall feedback about the CV.

    CV Text:
    {cv_text}

    Format response as:
    **Personalized Self-Introduction:** <content>
    **Overall Feedback:** <content>
    """

    # Set the Hugging Face model endpoint (e.g., GPT-2 model)
    endpoint = "https://api-inference.huggingface.co/models/gpt2"  # You can change this to another model if needed
    headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
    payload = {
        "inputs": prompt,
    }

    # Make the API request
    response = requests.post(endpoint, headers=headers, json=payload)

    if response.status_code == 200:
        # Extract the generated text from the response
        response_json = response.json()
        logger.info(f"Response JSON: {response_json}")
        generated_text = response_json[0].get('generated_text', '')
        
        # Debugging: Log the generated text
        logger.info(f"Generated text: {generated_text}")
        
        # Parse the generated text into structured format
        sections = generated_text.split("**")
        if len(sections) < 4:
            logger.error("Unexpected response format from Hugging Face API")
            raise Exception("Unexpected response format from Hugging Face API")
        
        try:
            script = {
                "personalized_intro": sections[1].split(":")[1].strip() if len(sections[1].split(":")) > 1 else "No personalized introduction generated.",
                "overall_feedback": sections[3].split(":")[1].strip() if len(sections[3].split(":")) > 1 else "No overall feedback generated."
            }
        except IndexError as e:
            logger.error(f"Error parsing generated text: {str(e)}")
            raise Exception("Error parsing generated text")
        
        return script
    else:
        logger.error(f"Error from Hugging Face API: {response.status_code}, {response.text}")
        raise Exception(f"Error from Hugging Face API: {response.status_code}, {response.text}")

# API Endpoint for CV Upload and Script Generation
@app.post("/generate_script/")
async def generate_script_endpoint(file: UploadFile = File(...)):
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

        # Generate script using the extracted CV text
        script_output = generate_script(text)
        return {"script": script_output}

    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# API Endpoint for generating script from text input
@app.post("/generate_script_from_text/")
async def generate_script_from_text(cv_text: str):
    try:
        script_output = generate_script(cv_text)
        return {"script": script_output}
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Run the server with uvicorn on all interfaces for external access
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)