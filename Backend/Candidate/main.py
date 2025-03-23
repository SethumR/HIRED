import os
import json
import uuid
from datetime import datetime
from typing import List, Dict
import speech_recognition as sr
import logging
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import subprocess
import tempfile
from pydub import AudioSegment
import io
import fitz  # PyMuPDF
import docx
from io import BytesIO

# ------------------ Setup & Configuration ------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from uri.env
load_dotenv("uri.env")

# Initialize FastAPI app
app = FastAPI(title="Hired AI Interview Platform")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory for audio files
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ------------------ OpenAI API Setup ------------------
openai.api_key = "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"

if not openai.api_key:
    logger.error("OpenAI API key not found")
    raise Exception("OpenAI API key not found")

# ------------------ In-memory Session Storage ------------------
interview_sessions = {}
uploaded_cvs = {}  # Dictionary to store uploaded CVs

# ------------------ Pydantic Models ------------------
class InterviewRequest(BaseModel):
    designation: str
    experience: str
    difficulty: str = "medium"  # Default to medium difficulty

class AudioResponse(BaseModel):
    status: str
    transcription: str
    validation_result: str
    feedback: str
    score: int
    total_score: int


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

# ------------------ API Endpoints ------------------

@app.post("/generate_script")
async def generate_script(file: UploadFile = File(...)):
    try:
        # Read the file content
        file_content = await file.read()  

        # Determine file type and extract text
        file_extension = file.filename.split('.')[-1].lower()

        if file_extension == 'pdf':
            text = extract_text_from_pdf(file_content)
        elif file_extension == 'docx':
            text = extract_text_from_docx(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")

        # Generate interview questions based on CV content
        questions = generate_interview_questions(text)
        
        # Send the generated questions back in the response
        return {"questions": questions}

    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_cv(file: UploadFile = File(...)) -> Dict[str, str]:
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
            "size": file_size,
            "upload_time": datetime.now().isoformat()
        }

        logger.info(f"Successfully uploaded CV: {file.filename} (ID: {cv_id})")
        return {
            "message": "CV uploaded successfully",
            "cv_id": cv_id,
            "filename": file.filename,
            "size": file_size
        }

    except HTTPException as e:
        logger.error(f"HTTP Exception during upload: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload CV: {str(e)}"
        )
# ------------------ Helper Functions ------------------

def generate_interview_questions(designation: str, experience: str, difficulty: str = "medium") -> List[dict]:
    """
    Generate 20 brief interview questions using OpenAI based on experience and difficulty.
    """
    try:
        logger.info(f"Generating questions for {designation} ({experience} level)")

        # Create a more specific system prompt based on the role
        system_prompt = f"""You are an expert technical interviewer specializing in {designation} positions.
        Your task is to generate technical interview questions that are:
        1. Specifically tailored for a {designation} role
        2. Appropriate for {experience} experience level
        3. Set at {difficulty} difficulty
        4. Focused on real-world scenarios and practical knowledge
        5. Cover both technical skills and problem-solving abilities specific to {designation}"""

        # Prepare the role-specific prompt
        prompt = f"""Generate exactly 20 unique technical interview questions for a {experience} {designation}.

        Requirements:
        1. Questions MUST be specifically focused on {designation} role
        2. Include questions about:
           - Core technical concepts for {designation}
           - Industry best practices in {designation} field
           - Common tools and technologies used in {designation} role
           - Security and compliance (if relevant)
           - Problem-solving scenarios specific to {designation}
        3. Difficulty level: {difficulty}
        4. Experience level: {experience}
        5. Each question must be unique and not generic
        6. Include practical, real-world scenarios

        Format each Q&A pair exactly as:
        Q1: [Brief, focused question specific to {designation}]
        A1: [Clear, concise answer with key points]

        Example format for a Cyber Security Engineer:
        Q1: How would you respond to a detected zero-day exploit in a production environment?
        A1: 1) Isolate affected systems 2) Analyze exploit pattern 3) Apply temporary mitigation 4) Work with vendors for patch 5) Monitor for similar patterns

        Generate exactly 20 questions following this format, ensuring each is highly relevant to {designation} role."""

        # Make API call with role-specific prompts
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        # Extract content from response
        content = response.choices[0].message.content
        lines = content.strip().split('\n')
        questions = []
        current_question = None

        # Process lines to extract questions and answers
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Match Q1-Q20 format
            if line.startswith('Q') and ':' in line and any(str(i) in line[:3] for i in range(1, 21)):
                if current_question:
                    questions.append(current_question)
                question_text = line.split(':', 1)[1].strip()
                current_question = {
                    'question': question_text,
                    'key_points': ['Role-specific knowledge', 'Technical accuracy', 'Practical application']
                }
            # Match A1-A20 format
            elif line.startswith('A') and ':' in line and any(str(i) in line[:3] for i in range(1, 21)) and current_question:
                answer_text = line.split(':', 1)[1].strip()
                current_question['model_answer'] = answer_text
                questions.append(current_question)
                current_question = None

        # Add the last question if it exists
        if current_question and 'model_answer' in current_question:
            questions.append(current_question)

        # Ensure we have exactly 20 questions
        if len(questions) < 20:
            logger.warning(f"Generated only {len(questions)} questions, retrying with modified prompt")
            # Retry once with a modified prompt
            return generate_interview_questions(designation, experience, difficulty)
        
        questions = questions[:20]  # Limit to exactly 20 questions
        
        # Validate questions
        if not questions:
            raise Exception("Failed to generate any questions")
        
        # Validate that questions are role-specific
        for q in questions:
            if not any(keyword.lower() in q['question'].lower() for keyword in designation.split()):
                logger.warning(f"Question may not be role-specific enough: {q['question']}")
        
        logger.info(f"Successfully generated {len(questions)} role-specific questions for {designation}")
        return questions

    except Exception as e:
        logger.error(f"Error in generate_interview_questions: {str(e)}")
        raise Exception(f"Failed to generate interview questions: {str(e)}")

def validate_answer(transcription: str, question_data: dict) -> dict:
    """
    Validate the user's answer using OpenAI.
    """
    try:
        prompt = f"""
        Question: {question_data['question']}
        User's Answer: {transcription}

        Please evaluate the answer based on:
        1. Technical accuracy
        2. Completeness
        3. Clarity of explanation

        Provide:
        1. A score out of 10
        2. Brief feedback
        3. Overall assessment (Correct/Partial/Incorrect)

        Format your response exactly as:
        Score: [number]/10
        Feedback: [your feedback]
        Assessment: [Correct/Partial/Incorrect]
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer. Evaluate the candidate's answer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )

        # Parse the response
        evaluation = response.choices[0].message.content
        
        # Extract score
        score_line = [line for line in evaluation.split('\n') if line.startswith('Score:')][0]
        score = int(score_line.split('/')[0].split(':')[1].strip())
        
        # Extract feedback
        feedback_line = [line for line in evaluation.split('\n') if line.startswith('Feedback:')][0]
        feedback = feedback_line.split(':', 1)[1].strip()
        
        # Extract assessment
        assessment_line = [line for line in evaluation.split('\n') if line.startswith('Assessment:')][0]
        result = assessment_line.split(':', 1)[1].strip()

        return {
            "result": result,
            "feedback": feedback,
            "score": score
        }
    except Exception as e:
        logger.error(f"Error in validate_answer: {str(e)}")
        return {
            "result": "Error",
            "feedback": "Failed to evaluate answer",
            "score": 0
        }

# ------------------ Endpoints ------------------

@app.post("/interview/start")
async def start_interview(request: InterviewRequest):
    """
    Start a new interview session with generated questions.
    """
    try:
        logger.info(f"Starting interview for {request.designation} with {request.experience} experience")
        
        # Generate questions using OpenAI
        try:
            questions = generate_interview_questions(request.designation, request.experience, request.difficulty)
            logger.info(f"Successfully generated {len(questions)} questions")
        except Exception as e:
            logger.error(f"Error generating questions: {str(e)}. Please check the OpenAI API key and the request format.")
            raise HTTPException(
                status_code=500,
                detail=str(e)
            )
        
        if not questions or len(questions) != 20:
            error_msg = f"Failed to generate exactly 20 questions. Got {len(questions) if questions else 0}"
            logger.error(error_msg)
            raise HTTPException(
                status_code=500,
                detail=error_msg
            )
        
        # Create new session
        session_id = str(uuid.uuid4())
        interview_sessions[session_id] = {
            "questions": questions,
            "current": 0,
            "start_time": datetime.now(),
            "designation": request.designation,
            "experience": request.experience,
            "answers": {},
            "total_score": 0,
            "questions_answered": 0
        }
        
        # Format response
        response_data = {
            "session_id": session_id,
            "questions": questions,
            "total_questions": len(questions),
            "question_number": 1,
            "is_complete": False
        }
        
        logger.info(f"Successfully created interview session {session_id}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error starting interview: {str(e)}. Please ensure all required fields are provided and the OpenAI API is functioning.")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start interview session: {str(e)}"
        )

@app.get("/interview/{session_id}/next")
async def get_next_question(session_id: str):
    """
    Get the next question or end the interview.
    """
    if session_id not in interview_sessions:
        raise HTTPException(status_code=404, detail="Interview session not found")
    
    session = interview_sessions[session_id]
    next_index = session["current"] + 1
    
    if next_index >= len(session["questions"]):
        # Calculate final statistics
        total_possible_score = len(session["questions"]) * 10
        percentage_score = (session["total_score"] / total_possible_score) * 100
        
        return {
            "is_complete": True,
            "message": "Interview completed",
            "statistics": {
                "total_score": session["total_score"],
                "percentage_score": round(percentage_score, 2),
                "questions_answered": session["questions_answered"],
                "total_questions": len(session["questions"])
            }
        }
    
    session["current"] = next_index
    return {
        "is_complete": False,
        "question": session["questions"][next_index]["question"],
        "question_number": next_index + 1,
        "total_questions": len(session["questions"])
    }

@app.post("/interview/audio/upload", response_model=AudioResponse)
async def upload_audio(
    file: UploadFile = File(...),
    session_id: str = Form(...),
    question_number: int = Form(...)
):
    """
    Process audio answer and validate it against the expected answer.
    """
    try:
        logger.info(f"Received audio upload - Session: {session_id}, Question: {question_number}")
        
        if session_id not in interview_sessions:
            raise HTTPException(status_code=404, detail="Session not found")

        session = interview_sessions[session_id]
        if question_number > len(session["questions"]):
            raise HTTPException(status_code=400, detail="Invalid question number")

        # Read the audio file
        audio_content = await file.read()
        
        # Save temporarily
        temp_path = f"{UPLOAD_DIR}/{uuid.uuid4()}.webm"
        with open(temp_path, "wb") as f:
            f.write(audio_content)

        try:
            # Transcribe using OpenAI Whisper API
            with open(temp_path, "rb") as audio_file:
                logger.info("Starting transcription with Whisper API")
                transcript = openai.Audio.transcribe(
                    "whisper-1",
                    audio_file,
                    language="en"
                )
                transcription = transcript.text
                logger.info(f"Transcription result: {transcription}")

            # Get current question and validate answer
            current_question = session["questions"][question_number - 1]
            validation = validate_answer(transcription, current_question)
            
            # Update session score
            if "total_score" not in session:
                session["total_score"] = 0
            session["total_score"] += validation["score"]
            
            # Update questions answered count
            if "questions_answered" not in session:
                session["questions_answered"] = 0
            session["questions_answered"] += 1

            return AudioResponse(
                status="success",
                transcription=transcription,
                validation_result=validation["result"],
                feedback=validation["feedback"],
                score=validation["score"],
                total_score=session["total_score"]
            )

        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ------------------ Run the App ------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
