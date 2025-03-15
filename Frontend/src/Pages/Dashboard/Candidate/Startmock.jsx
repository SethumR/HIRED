import React, { useState, useEffect, useRef } from "react";
import { Mic, ArrowRight, RotateCcw, HelpCircle, FileText, X, MicOff } from "lucide-react";
import Sidebar from "./SideBar";  // Importing your custom Sidebar component

export default function InterviewAI() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const timerRef = useRef(null);

  // User profile data for the sidebar
  const userProfile = {
    name: "Sarah Wilson",
    title: "Software Engineer",
    initials: "SW",
  };

  // Format seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Toggle speaking state
  const handleSpeakToggle = () => {
    if (!isSessionActive) return;
    setIsSpeaking((prev) => !prev);
  };

  // End the session
  const handleEndSession = () => {
    setIsSessionActive(false);
    setIsSpeaking(false);
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

  return (
    // Main container - adjusted to account for site header and footer
    <div className="flex flex-1 bg-[#0b0f1c] text-white min-h-[calc(100vh-120px)]">
      {/* Include the Sidebar component */}
      <Sidebar userProfile={userProfile} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto py-20">
        {/* Session controls - made more prominent and fixed at the top of the content area */}
        <div className="sticky top-0 z-20 w-full bg-[#0b0f1c] border-b border-gray-800 px-4 py-4 flex justify-center items-center shadow-lg">
      {/* Comment: This header contains session controls and stays visible when scrolling */}
      <div className="bg-gray-800/70 px-4 py-2 rounded-md text-gray-300 text-base flex items-center mr-4">
        <span className="mr-2 font-semibold">Duration:</span> {formatTime(duration)}
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

        {/* Main content with interview interface */}
        <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto gap-6 p-4">
          {/* Left panel - Question area */}
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
                <span className="text-sm text-blue-400">Question 2 of 5</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-100">
                Can you describe a challenging project you've worked on and how you handled it?
              </h3>
              {!isSpeaking && (
                <div className="items-center gap-2 text-gray-400 mb-4 bg-gray-800/50 p-3 rounded-lg inline-flex">
                  <svg
                    className="w-5 h-5 text-blue-400 animate-pulse"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                    <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                  </svg>
                  <span className="text-base">AI is speaking...</span>
                </div>
              )}
            </div>

            <div className="bg-blue-900/30 p-5 rounded-xl mb-6 border border-blue-800/50">
              <h4 className="text-blue-300 font-medium mb-2 text-base">Real-time Feedback</h4>
              <p className="text-gray-300 text-base">
                Try structuring your answer using the STAR method: Situation, Task, Action, and Result.
              </p>
            </div>
          </div>

          {/* Right panel - Answer area */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-start pt-10">
              <button
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg transition-all duration-300 ${
                  isSpeaking
                    ? "bg-red-500 shadow-red-900/30 scale-105 sm:scale-110"
                    : "bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-900/30"
                } ${!isSessionActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleSpeakToggle}
                disabled={!isSessionActive}
              >
                {isSpeaking ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              <p className="text-base text-gray-400 mb-2">{isSpeaking ? "Tap to pause" : "Tap to speak"}</p>

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
                  "In my previous role, I was tasked with leading a team of five developers to deliver a critical client
                  project. The main challenge was..."
                </p>
              </div>
            </div>

            {/* Bottom buttons row - added extra spacing at bottom for footer clearance */}
            {/* Comment: Extra padding and margin added to prevent buttons from being covered by footer */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 mb-16">
              <button
                className="flex items-center justify-center gap-2 border border-gray-700 text-gray-300 hover:bg-gray-800 text-base h-10 px-4 rounded-md"
                disabled={!isSessionActive}
              >
                <RotateCcw className="w-4 h-4" />
                Retry Answer
              </button>
              <div className="flex justify-center sm:justify-end gap-2">
                <button
                  className="text-gray-400 hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-md"
                  disabled={!isSessionActive}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button
                  className="text-gray-400 hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-md"
                  disabled={!isSessionActive}
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center gap-2 border-0 text-base h-10 px-4 rounded-md"
                  disabled={!isSessionActive}
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}