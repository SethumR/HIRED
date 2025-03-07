import React, { useState } from 'react';

const InterviewAI = () => {
  const [industry, setIndustry] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('Medium');

  // Mock data
  const industries = [
    'Technology', 
    'Finance', 
    'Healthcare', 
    'Marketing', 
    'Engineering'
  ];
  
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 px-4" style={{ marginTop: '100px' }}>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Customize Your Mock Interview</h1>
        <p className="text-center text-gray-600 mb-8">Fill in the details below to generate a personalized interview experience</p>
        
        <div className="space-y-6">
          {/* Industry Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Industry</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="">Select an industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          
          {/* Job Role */}
          <div>
            <label className="block text-gray-700 mb-2">Job Role</label>
            <input 
              type="text" 
              placeholder="e.g. Software Engineer, Data Scientist" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>
          
          {/* Experience Level */}
          <div>
            <label className="block text-gray-700 mb-2">Level of Experience</label>
            <div className="grid grid-cols-3 gap-4">
              {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                <button
                  key={level}
                  className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                    experienceLevel === level 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setExperienceLevel(level)}
                >
                  <div className={`mb-2 ${experienceLevel === level ? 'text-blue-600' : 'text-gray-600'}`}>
                    {level === 'Entry Level' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    )}
                    {level === 'Mid Level' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {level === 'Senior Level' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${experienceLevel === level ? 'text-blue-600' : 'text-gray-700'}`}>
                    {level}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Question Difficulty */}
          <div>
            <label className="block text-gray-700 mb-2">Preferred Question Difficulty</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={questionDifficulty}
              onChange={(e) => setQuestionDifficulty(e.target.value)}
            >
              {difficultyLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          {/* Start Button */}
          <button 
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Mock Interview
          </button>
        </div>
      </div>
      
      {/* What to Expect Section */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">What to Expect</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Questions</h3>
            <p className="text-gray-600">Questions tailored to your experience level and industry</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Feedback</h3>
            <p className="text-gray-600">Instant feedback on your responses and performance</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Detailed Analysis</h3>
            <p className="text-gray-600">Comprehensive review of your interview performance</p>
          </div>
        </div>
      </div>
      
      {/* Success Stories Section */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start space-x-4">
              <img 
                src="/api/placeholder/64/64" 
                alt="Sarah Chen" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Sarah Chen</h3>
                <p className="text-gray-600 mb-3">Software Engineer at Tech Co</p>
                <p className="text-gray-700 italic">
                  "MockMaster helped me prepare for my dream job interview. The personalized questions were spot-on!"
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start space-x-4">
              <img 
                src="/api/placeholder/64/64" 
                alt="Michael Rodriguez" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Michael Rodriguez</h3>
                <p className="text-gray-600 mb-3">Data Scientist at Analytics Inc</p>
                <p className="text-gray-700 italic">
                  "The platform's feedback system helped me identify and improve my weak points. Highly recommended!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewAI;