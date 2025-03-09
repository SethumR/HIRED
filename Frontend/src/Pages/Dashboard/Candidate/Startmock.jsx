import React from 'react';
import { Clock, X, Mic, RotateCw, HelpCircle, FileText, ArrowRight } from 'lucide-react';

const Startmock = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1c] text-white mt-[92px]">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0d1221] mb-5">
        <div className="flex items-center gap-3">
          <div className="text-purple-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="#8B5CF6" />
              <circle cx="12" cy="10" r="3" fill="white" />
              <rect x="7" y="15" width="10" height="3" rx="1.5" fill="white" />
            </svg>
          </div>
          <span className="font-semibold text-lg">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={16} />
            <span>Duration: 12:45</span>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white px-3 py-1 rounded-xl flex items-center gap-1 transition duration-300">
            <X size={16} />
            End Interview
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-6 flex">
        {/* Left Panel - Interviewer */}
        <div className="w-2/3 pr-6 border-r border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#0d1221] rounded-full flex items-center justify-center border border-gray-800">
              <div className="w-8 h-8 text-purple-500">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" fill="#8B5CF6" />
                  <circle cx="12" cy="10" r="3" fill="white" />
                  <rect x="7" y="15" width="10" height="3" rx="1.5" fill="white" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">AI Interviewer</h2>
              <p className="text-gray-400">Technical Interview Specialist</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Progress</p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="flex justify-end text-purple-500 text-sm mt-1">Question 2 of 5</div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-lg mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Can you describe a challenging project you've worked on and how you handled it?</h3>
            
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <div className="p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="7" y="15" width="10" height="3" rx="1.5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <span>AI is speaking...</span>
            </div>

            <div className="bg-[#0d1221] p-4 rounded-lg mb-4 border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h4 className="text-purple-500 font-medium mb-2">Real-time Feedback</h4>
              <p className="text-gray-400">Try structuring your answer using the STAR method: Situation, Task, Action, and Result.</p>
            </div>
          </div>
        </div>

        {/* Right Panel - User */}
        <div className="w-1/3 flex flex-col pl-6">
          <div className="flex-1 flex flex-col bg-[#0d1221] rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg p-6">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-cyan-500/20 shadow-lg">
                <Mic size={56} className="text-white" />
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="font-medium mb-2 text-white">Hold to Speak</p>
              <div className="bg-[#0b0f1c] p-3 rounded-lg border border-gray-800">
                <p className="text-gray-400">"In my previous role, I was tasked with leading a team of five developers to deliver a critical client project. The main challenge was..."</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button className="border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-400 bg-[#0b0f1c] hover:bg-[#0d1221]">
                <RotateCw size={16} />
                Retry Answer
              </button>
              <div className="flex gap-2">
                <button className="border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-gray-400 bg-[#0b0f1c] hover:bg-[#0d1221]">
                  <HelpCircle size={16} />
                </button>
                <button className="border border-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-gray-400 bg-[#0b0f1c] hover:bg-[#0d1221]">
                  <FileText size={16} />
                </button>
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition duration-300">
                Next Question
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Interview Tips */}
          <div className="mt-6 p-6 bg-[#0d1221] rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
            <h3 className="text-center font-medium text-lg mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Interview Tips</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="px-4">
                <h4 className="font-medium mb-2 text-white">Speak Clearly</h4>
                <p className="text-sm text-gray-400">Maintain a steady pace and enunciate your words</p>
              </div>
              <div className="px-4">
                <h4 className="font-medium mb-2 text-white">Be Specific</h4>
                <p className="text-sm text-gray-400">Use concrete examples to support your answers</p>
              </div>
              <div className="px-4">
                <h4 className="font-medium mb-2 text-white">Stay Focused</h4>
                <p className="text-sm text-gray-400">Keep your answers relevant to the question</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Startmock;