# Import required libraries
from flask import Flask, request, make_response
from flask_cors import CORS
import openai
import uuid
import speech_recognition as sr

# Initialize Flask app and enable CORS for all domains
app = Flask(__name__)
# Allow cross-origin requests from any domain and expose custom session header
CORS(app, resources={r"/*": {"origins": "*"}}, expose_headers=["X-Session-ID"])

# In-memory storage for interview sessions: maps session IDs to question lists and current index
sessions = {}

@app.route('/interview/start', methods=['POST'])
def start_interview():
    """
    Start a new interview session with generated questions.
    Expects JSON { "designation": ..., "experience": ... } in request body.
    """
    data = request.get_json()
    designation = data.get('designation')
    experience = data.get('experience')
    if not designation or not experience:
        return "Missing designation or experience level", 400

    # Use OpenAI to generate questions
    prompt = f"Generate 20 brief technical interview questions for a {experience} {designation}."
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Generate concise technical interview questions."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    # Parse the response into questions
    content = response.choices[0].message.content
    lines = [line.strip() for line in content.split('\n') if line.strip()]
    # Ensure we have exactly 20 questions
    lines = lines[:20]  # Limit to 20 questions

    # Store the list of questions in session
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        'questions': lines,
        'current': 0
    }
    
    return {
        "session_id": session_id,
        "questions": lines,
        "status": "success"
    }

@app.route('/interview/audio/upload', methods=['POST'])
def upload_audio():
    """
    Upload an audio file and return the transcription and next question.
    Expects a session_id as a form field and an audio file.
    """
    session_id = request.form.get('session_id')
    if not session_id:
        return "Missing session_id", 400
    if session_id not in sessions or 'file' not in request.files:
        return "Invalid session_id", 404

    audio_file = request.files['file']
    
    # Save the audio file
    file_path = f"uploads/{uuid.uuid4()}.wav"
    audio_file.save(file_path)

    # Transcribe the audio using SpeechRecognition
    recognizer = sr.Recognizer()
    with sr.AudioFile(file_path) as source:
        audio_data = recognizer.record(source)
        transcription = recognizer.recognize_google(audio_data)

    # Fetch the next question
    session_data = sessions[session_id]
    questions = session_data['questions']
    last_index = session_data['current']
    next_index = last_index + 1  # index of the next question to deliver
    if next_index >= len(questions):
        # No more questions available; interview is finished
        sessions.pop(session_id, None)  # clean up session data
        return "No more questions", 404

    # Retrieve the next question and update the current index
    next_question_text = questions[next_index]

    sessions[session_id]['current'] += 1

    # Validate the user's answer using OpenAI
    question_data = {
        'question': next_question_text,
        'model_answer': "Expected model answer here",  # Replace with actual model answer
        'key_points': ['Technical accuracy', 'Clear explanation']
    }
    validation = validate_answer(transcription, question_data)

    response = {
        'transcription': transcription,
        'next_question': next_question_text,
        'validation_result': validation['result'],
        'feedback': validation['feedback'],
        'score': validation['score']
    }

    return make_response(response, 200)

def next_question():
    """
    Fetch the next interview question for an existing session:
    - Expects a session_id as a query parameter.
    - Returns the next question in plain text (if available).
    """
    session_id = request.form.get('session_id')

    if not session_id:
        return "Missing session_id", 400
    if session_id not in sessions or 'file' not in request.files:
        return "Invalid session_id", 404

    audio_file = request.files['file']
    
    # Process the audio file (e.g., save it, transcribe it)
    # For demonstration, we'll just return a placeholder transcription
    transcription = "Transcribed text from audio"  # Replace with actual transcription logic

    # Fetch the next question
    session_data = sessions[session_id]

    questions = session_data['questions']
    last_index = session_data['current']
    next_index = last_index + 1  # index of the next question to deliver
    if next_index >= len(questions):
        # No more questions available; interview is finished
        sessions.pop(session_id, None)  # clean up session data
        return "No more questions", 404

    # Retrieve the next question and update the current index
    next_question_text = questions[session_data['current']]

    sessions[session_id]['current'] += 1

    # Return the next question as plain text (no JSON, no extra metadata)
    response = {
        'transcription': transcription,
        'next_question': next_question_text
    }

    response.mimetype = 'text/plain'
    return make_response(response, 200)

# Run the Flask app (for local testing). In production, use a WSGI server.
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
