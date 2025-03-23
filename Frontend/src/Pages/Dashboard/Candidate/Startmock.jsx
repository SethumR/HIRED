import React, { useState, useEffect, useRef } from "react";
import { Mic, ArrowRight, RotateCcw, HelpCircle, FileText, X, MicOff } from "lucide-react";
import Sidebar from "./SideBar";  // Importing your custom Sidebar component
import axios from "axios";

// Interview Summary Popup Component
const InterviewSummary = ({ isOpen, totalDuration, totalQuestions, answeredQuestions, points, percentageScore, onClose }) => {
  useEffect(() => {
    if (isOpen && percentageScore !== undefined) {
      // Get the interview data from localStorage
      const interviewData = JSON.parse(localStorage.getItem('interviewData') || '{}');
      
      // Create new history entry
      const historyEntry = {
        id: Date.now(),
        industry: interviewData.industry || 'Not specified',
        role: interviewData.designation,
        experience: interviewData.experience,
        date: new Date().toLocaleDateString(),
        score: Math.round(percentageScore),
        totalQuestions,
        answeredQuestions,
        points
      };

      // Get existing history
      const currentHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      
      // Add new entry at the beginning
      const updatedHistory = [historyEntry, ...currentHistory];
      
      // Save updated history
      localStorage.setItem('interviewHistory', JSON.stringify(updatedHistory));
      
      // Dispatch event to notify InterviewHistory component
      window.dispatchEvent(new Event('interviewCompleted'));
    }
  }, [isOpen, percentageScore]);

  if (!isOpen) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f2e] rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Interview Summary</h2>
        
        <div className="space-y-6">
          {/* Score */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Overall Score</h3>
            <div className="flex items-end gap-2">
              <p className={`text-4xl font-bold ${getScoreColor(percentageScore)}`}>
                {percentageScore}%
              </p>
              <p className="text-gray-400 text-sm mb-1">({points} points)</p>
            </div>
          </div>
          
          {/* Duration */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Total Duration</h3>
            <p className="text-white text-2xl font-bold">{formatTime(totalDuration)}</p>
          </div>
          
          {/* Questions Stats */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Questions</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">Total Questions</p>
                <p className="text-white text-xl font-bold">{totalQuestions}</p>
              </div>
              <div>
                <p className="text-gray-400">Answered</p>
                <p className="text-white text-xl font-bold">{answeredQuestions}</p>
              </div>
            </div>
          </div>
          
          {/* Feedback */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Overall Assessment</h3>
            <p className="text-gray-300">
              {percentageScore >= 80 
                ? "Outstanding performance! You demonstrated excellent technical knowledge and communication skills."
                : percentageScore >= 60
                ? "Good performance! You showed solid understanding of the concepts with room for improvement."
                : percentageScore >= 40
                ? "Fair performance. Consider reviewing the topics and practicing more."
                : "More preparation needed. Focus on strengthening your technical knowledge."}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};

// Add QuestionList component
const QuestionList = ({ questions, currentNumber, onSelectQuestion }) => {
  if (!questions.length) return null;
  
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-[#1a1f2e] border-l border-gray-800 p-4 overflow-y-auto">
      <h3 className="text-lg font-medium mb-4 text-white">All Questions</h3>
      <div className="space-y-2">
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(index + 1)}
            className={`w-full text-left p-3 rounded-lg text-sm ${
              currentNumber === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
            }`}
          >
            <span className="font-medium">Q{index + 1}:</span> {q.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function InterviewAI() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [sessionId, setSessionId] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [hasSpokenAnswer, setHasSpokenAnswer] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [interviewStats, setInterviewStats] = useState({
    totalDuration: 0,
    answeredQuestions: 0
  });
  const [answerValidation, setAnswerValidation] = useState(null);
  const [points, setPoints] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [percentageScore, setPercentageScore] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    title: "",
    initials: ""
  });

  // Start the interview session when component mounts
  useEffect(() => {
    const interviewData = JSON.parse(localStorage.getItem('interviewData'));
    
    if (!interviewData || !interviewData.designation || !interviewData.experience) {
      setIsSessionActive(false);
      setCurrentQuestion("Please start from the interview setup page.");
      setAudioError("No interview data found. Please set up your interview first.");
      return;
    }

    // Update user profile
    setUserProfile({
      name: "Candidate",
      title: interviewData.designation,
      initials: "C"
    });
    
    // If we already have questions from the setup page, use them
    if (interviewData.questions && interviewData.sessionId) {
      setSessionId(interviewData.sessionId);
      setAllQuestions(interviewData.questions);
      setCurrentQuestion(interviewData.questions[0].question);
      setTotalQuestions(interviewData.totalQuestions);
      setQuestionNumber(1);
      setIsLoading(false);
      setIsSessionActive(true);
    } else {
      // Otherwise start a new interview
      startInterview();
    }
  }, []);

  // Start interview session
  const startInterview = async () => {
    try {
      setIsLoading(true);
      setAudioError(null);
      
      const interviewData = JSON.parse(localStorage.getItem('interviewData'));
      
      if (!interviewData || !interviewData.designation || !interviewData.experience) {
        throw new Error("Interview details not found. Please start from the interview setup page.");
      }
      
      console.log("Starting interview with:", interviewData); // Debug log
      
      const response = await axios.post("http://localhost:8000/interview/start", {
        designation: interviewData.designation,
        experience: interviewData.experience,
        difficulty: interviewData.difficulty || "medium"
      });

      console.log("Interview start response:", response.data); // Debug log

      if (response.data && response.data.questions && Array.isArray(response.data.questions)) {
        const questions = response.data.questions;
        const updatedInterviewData = {
          ...interviewData,
          sessionId: response.data.session_id,
          questions: questions,
          totalQuestions: response.data.total_questions,
          currentQuestion: 1
        };
        
        // Update localStorage with the new data
        localStorage.setItem('interviewData', JSON.stringify(updatedInterviewData));
        
        setSessionId(response.data.session_id);
        setAllQuestions(questions);
        setCurrentQuestion(questions[0].question);
        setTotalQuestions(response.data.total_questions);
        setQuestionNumber(1);
        setTranscription("");
        setAnswerValidation(null);
        setCurrentFeedback(null);
        setDuration(0);
        setIsSessionActive(true);
        setAudioError(null);
        
        console.log("Successfully set questions:", questions.length); // Debug log
      } else {
        console.error("Invalid response format:", response.data); // Debug log
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      setIsSessionActive(false);
      setCurrentQuestion("Error loading questions. Please start from the interview setup page.");
      setAudioError(error.response?.data?.detail || error.message || "Failed to load interview questions");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next question
  const handleNextQuestion = async () => {
    if (!sessionId) {
      console.error("No session ID available");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Fetching next question with session ID:", sessionId);
      
      const response = await axios.get(`http://localhost:8000/interview/${sessionId}/next`);
      
      console.log("Next question response:", response.data);
      
      if (response.data.is_complete) {
        console.log("Interview complete, showing summary");
        handleEndSession();
        return;
      }

      if (!response.data.question) {
        throw new Error("No question received from server");
      }

      // Update the current question and question number
      setCurrentQuestion(response.data.question);
      setQuestionNumber(response.data.question_number);
      
      // Reset states for new question
      setTranscription("");
      setDuration(0);
      setAnswerValidation(null);
      setCurrentFeedback(null);
      setHasSpokenAnswer(false);
      
      console.log("Successfully moved to question:", response.data.question_number);
      
    } catch (error) {
      console.error("Error getting next question:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to load next question";
      setAudioError(errorMessage);
      console.error("Detailed error:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle audio submission
  const handleSubmitAnswer = async (audioBlob) => {
    try {
      setIsProcessingAudio(true);
      setAudioError(null);
      setAnswerValidation(null);
      setCurrentFeedback(null);

      const formData = new FormData();
      formData.append('file', audioBlob, 'answer.webm');
      formData.append('session_id', sessionId);
      formData.append('question_number', questionNumber);

      const response = await axios.post('http://localhost:8000/interview/audio/upload', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        }
      );

      if (response.data.status === "success") {
        const { transcription, validation_result, feedback, score, total_score } = response.data;
        
        setTranscription(transcription);
        setHasSpokenAnswer(true);
        setAnswerValidation(validation_result);
        setCurrentFeedback(feedback);
        setPoints(total_score);
        
        // Update interview stats
        setInterviewStats(prev => ({
          ...prev,
          answeredQuestions: prev.answeredQuestions + 1,
          points: total_score
        }));
      } else {
        setTranscription("Failed to process audio");
        setHasSpokenAnswer(false);
        setAudioError("Failed to process answer");
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setTranscription("");
      setHasSpokenAnswer(false);
      setAnswerValidation(null);
      setAudioError(
        error.response?.data?.error || 
        error.message || 
        "Failed to process audio. Please try again."
      );
    } finally {
      setIsProcessingAudio(false);
    }
  };

  // Handle audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });
      
      const options = {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000
      };
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          if (audioBlob.size < 1024) {  // Less than 1KB
            throw new Error("Recording too short. Please speak for a longer duration.");
          }

          console.log('Submitting audio:', {
            blobSize: audioBlob.size,
            sessionId,
            questionNumber,
            mimeType: audioBlob.type
          });

          setIsProcessingAudio(true);
          setAudioError(null);
          
          const formData = new FormData();
          formData.append('file', audioBlob, 'answer.webm');
          formData.append('session_id', sessionId);
          formData.append('question_number', questionNumber);

          const response = await axios.post(
            'http://localhost:8000/interview/audio/upload',
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 30000
            }
          );

          console.log('Audio submission response:', response.data);

          if (response.data) {
            setTranscription(response.data.transcription);
            setHasSpokenAnswer(true);
            setAnswerValidation(response.data.validation_result);
            setCurrentFeedback(response.data.feedback);
            setPoints(response.data.total_score);
          } else {
            throw new Error("Invalid response format from server");
          }
        } catch (error) {
          console.error('Error in recording stop handler:', error);
          setAudioError(error.response?.data?.detail || error.message || "Failed to process recording");
          setHasSpokenAnswer(false);
        } finally {
          setIsProcessingAudio(false);
          if (stream && stream.getTracks) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      };

      mediaRecorderRef.current.start(1000);
      setIsSpeaking(true);
      setHasSpokenAnswer(false);
      setTranscription("");
      setAudioError(null);
      setAnswerValidation(null);
      setCurrentFeedback(null);
    } catch (error) {
      console.error('Microphone error:', error);
      setAudioError("Failed to access microphone. Please ensure microphone permissions are granted.");
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsSpeaking(false);
      setIsProcessingAudio(false);
      setAudioError("Error stopping recording");
    }
  };

  // Toggle speaking state
  const handleSpeakToggle = () => {
    if (!isSessionActive) return;
    if (isSpeaking) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // End the session
  const handleEndSession = async () => {
    setIsSessionActive(false);
    setIsSpeaking(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      stopRecording();
    }
    
    // Get final statistics from the session
    try {
      const response = await axios.get(`http://localhost:8000/interview/${sessionId}/next`);
      if (response.data.statistics) {
        setInterviewStats({
          totalDuration: duration,
          answeredQuestions: response.data.statistics.questions_answered,
          points: response.data.statistics.total_score
        });
        setPercentageScore(response.data.statistics.percentage_score);
      }
    } catch (error) {
      console.error("Error getting final statistics:", error);
    }
    
    setShowSummary(true);
  };

  // Timer effect
  useEffect(() => {
    if (isSpeaking && isSessionActive) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isSpeaking, isSessionActive]);

  // Clean up effect
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        stopRecording();
      }
    };
  }, []);

  return (
    <div className="flex flex-1 bg-[#0b0f1c] text-white min-h-[calc(100vh-120px)]">
      <Sidebar userProfile={userProfile} />
      <div className={`flex-1 flex flex-col overflow-y-auto py-20 ${showQuestionList ? 'mr-80' : ''}`}>
        <div className="sticky top-0 z-20 w-full bg-[#0b0f1c] border-b border-gray-800 px-4 py-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <div className="bg-gray-800/70 px-4 py-2 rounded-md text-gray-300 text-base flex items-center mr-4">
              <span className="mr-2 font-semibold">Duration:</span> {formatTime(duration)}
            </div>
            <button
              className="flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 text-white text-sm h-10 px-5 rounded-md font-medium"
              onClick={() => setShowQuestionList(!showQuestionList)}
            >
              <FileText className="h-4 w-4" />
              <span>{showQuestionList ? "Hide Questions" : "Show All Questions"}</span>
            </button>
          </div>
          <button
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm h-10 px-5 rounded-md font-medium"
            onClick={handleEndSession}
            disabled={!isSessionActive}
          >
            <X className="h-4 w-4" />
            <span>End Session</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto gap-6 p-4">
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <img 
                  src="animated.gif" 
                  alt="GIF Icon" 
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="text-xl font-bold">Hired</h2>
                  <p className="text-sm text-gray-400">Technical Interview Specialist</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-blue-400">Question {questionNumber} of {totalQuestions}</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-100">
                {isLoading ? "Loading question..." : currentQuestion}
              </h3>
            </div>

            <div className="bg-blue-900/30 p-5 rounded-xl mb-6 border border-blue-800/50">
              <h4 className="text-blue-300 font-medium mb-2 text-base">Real-time Feedback</h4>
              <p className="text-gray-300 text-base">
                Try structuring your answer using the STAR method: Situation, Task, Action, and Result.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-start pt-10">
              <button
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all duration-300 ${
                  isSpeaking
                    ? "bg-red-500 shadow-red-900/30 scale-105 sm:scale-110"
                    : "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-900/30"
                } ${!isSessionActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleSpeakToggle}
                disabled={!isSessionActive || isLoading}
              >
                {isSpeaking ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              <p className="text-base text-gray-400 mb-2">{isSpeaking ? "Tap to stop" : "Tap to speak"}</p>

              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-red-500 animate-pulse" : "bg-gray-600"}`}
                ></div>
                <div className="bg-gray-800/70 px-3 py-1 rounded-md text-gray-300 text-base">
                  {formatTime(duration)}
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-red-500 animate-pulse" : "bg-gray-600"}`}
                ></div>
              </div>

              <div className="w-full bg-gray-800/50 p-5 rounded-xl mb-6 border border-gray-700/50 shadow-md">
                <p className="text-gray-300 text-base">
                  {isProcessingAudio ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⚪</span>
                      Converting speech to text...
                    </span>
                  ) : transcription ? (
                    <>
                      <span className="block mb-3">{transcription}</span>
                      {answerValidation && (
                        <div className={`mt-2 ${
                          answerValidation === "Correct" ? "text-green-400" : 
                          answerValidation === "Partial" ? "text-yellow-400" : 
                          "text-red-400"
                        } text-sm flex items-center`}>
                          <span className="mr-2">
                            {answerValidation === "Correct" ? "✓" : 
                             answerValidation === "Partial" ? "!" : "✗"}
                          </span>
                          {currentFeedback}
                        </div>
                      )}
                    </>
                  ) : (
                    "Your answer will appear here after you speak..."
                  )}
                </p>
                {hasSpokenAnswer && transcription && !transcription.includes("Failed") && !transcription.includes("Error") && (
                  <div className="mt-2 text-green-400 text-sm flex items-center">
                    <span className="mr-2">✓</span>
                    Answer recorded successfully
                  </div>
                )}
                {audioError && (
                  <div className="mt-2 text-red-400 text-sm flex items-center">
                    <span className="mr-2">⚠</span>
                    {audioError}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 mb-16">
              <button
                className="flex items-center justify-center gap-2 border border-gray-700 text-gray-300 hover:bg-gray-800 text-base h-10 px-4 rounded-md"
                onClick={() => {
                  setTranscription("");
                  setDuration(0);
                }}
                disabled={!isSessionActive || isLoading}
              >
                <RotateCcw className="w-4 h-4" />
                Retry Answer
              </button>
              <div className="flex justify-center sm:justify-end gap-2">
                <button
                  className="text-gray-400 hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-md"
                  disabled={!isSessionActive || isLoading}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button
                  className="text-gray-400 hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-md"
                  disabled={!isSessionActive || isLoading}
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center gap-2 border-0 text-base h-10 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleNextQuestion}
                  disabled={!isSessionActive || isLoading || isProcessingAudio}
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Summary Popup */}
      <InterviewSummary
        isOpen={showSummary}
        totalDuration={interviewStats.totalDuration}
        totalQuestions={totalQuestions}
        answeredQuestions={interviewStats.answeredQuestions}
        points={points}
        percentageScore={percentageScore}
        onClose={() => setShowSummary(false)}
      />

      {showQuestionList && (
        <QuestionList
          questions={allQuestions}
          currentNumber={questionNumber}
          onSelectQuestion={(num) => {
            setQuestionNumber(num);
            setCurrentQuestion(allQuestions[num - 1].question);
            setTranscription("");
            setAnswerValidation(null);
            setCurrentFeedback(null);
          }}
        />
      )}
    </div>
  );
}

// Format seconds to MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
