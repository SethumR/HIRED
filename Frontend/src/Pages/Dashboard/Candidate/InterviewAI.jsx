import React, { useState } from 'react';

const InterviewAI = () => {
  const [industry, setIndustry] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const industries = ['Technology', 'Finance', 'Healthcare', 'Marketing', 'Engineering'];
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  // Function to check if all fields are valid
  const isFormValid = () => {
    return (
      industry.trim() !== '' &&
      jobRole.trim() !== '' &&
      experienceLevel.trim() !== '' &&
      questionDifficulty.trim() !== '' &&
      uploadSuccess
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Selected file:', selectedFile);
    setFileError('');
    setUploadSuccess(false);
    if (!selectedFile) {
      console.log('No file selected');
      setFile(null);
      setFileName('');
      return;
    }
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!validTypes.includes(selectedFile.type)) {
      console.log('Invalid file type');
      setFileError('Please upload a PDF or Word document');
      setFile(null);
      setFileName('');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      console.log('File too large');
      setFileError('File size should not exceed 5MB');
      setFile(null);
      setFileName('');
      return;
    }
    console.log('File validated:', selectedFile.name);
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = () => {
    if (!file) {
      console.log('No file to upload');
      setFileError('Please upload your CV');
      return;
    }
    console.log('Starting upload process');
    setIsUploading(true);
    setTimeout(() => {
      console.log('File uploaded successfully:', file.name);
      setIsUploading(false);
      setUploadSuccess(true);
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0b0f1c] text-white py-8 px-4 pt-24">
      <div className="w-full max-w-2xl mx-auto bg-[#0d1221] rounded-lg p-6 mb-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Customize Your Mock Interview</h1>
        <p className="text-center text-gray-400 mb-8">Fill in the details below to generate a personalized interview experience</p>
        <div className="space-y-6">
          {/* CV Upload Section */}
          <div className="p-5 border border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Upload Your CV</h2>
            <div
              className={`border-2 border-dashed rounded-lg p-5 mb-4 text-center ${
                fileError ? 'border-red-400 bg-red-500/10' : 'border-gray-700 hover:border-purple-500'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="cv-file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
              {!fileName ? (
                <>
                  <svg className="mx-auto h-10 w-10 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M24 8l-8 8h6v18h4V16h6l-8-8z" fill="currentColor" />
                    <path d="M8 30v10h32V30" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-400">
                    Drag and drop your CV here, or{' '}
                    <label htmlFor="cv-file" className="text-purple-500 cursor-pointer hover:text-purple-400">
                      browse files
                    </label>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF or Word documents, max 5MB
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-300 truncate">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-400"
                    onClick={() => {
                      setFile(null);
                      setFileName('');
                      setUploadSuccess(false);
                    }}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {fileError && (
              <p className="text-red-500 text-sm mb-3">{fileError}</p>
            )}
            {uploadSuccess && (
              <div className="mb-3 p-2 bg-green-900/30 text-green-500 rounded-md flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                CV uploaded successfully!
              </div>
            )}
            <button
              type="button"
              disabled={isUploading || !file}
              onClick={handleUpload}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isUploading || !file 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload CV'
              )}
            </button>
          </div>
<<<<<<< Updated upstream

          {/* Form Fields */}

          
                <div>
                <label className="block text-white mb-2">Industry</label>
                <select 
                  className="w-full p-3 border border--800 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-[#0b0f1c] text-white"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
=======
          {/* Industry Selection */}
          <div>
            <label className="block text-white mb-2">Industry</label>
            <select 
              className="w-full p-3 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#0b0f1c] text-white"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="" disabled>Select Industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          {/* Job Role */}
          <div>
            <label className="block text-white mb-2">Job Role</label>
            <input 
              type="text" 
              placeholder="e.g. Software Engineer, Data Scientist" 
              className="w-full p-3 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-[#0b0f1c] text-white"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>
          {/* Experience Level */}
          <div>
            <label className="block text-white mb-2">Level of Experience</label>
            <div className="grid grid-cols-3 gap-4">
              {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                <button
                  key={level}
                  className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                    experienceLevel === level 
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/30 border-purple-500' 
                      : 'border-gray-800 hover:bg-[#1a1f2e]'
                  }`}
                  onClick={() => setExperienceLevel(level)}
>>>>>>> Stashed changes
                >
                  <option value="" disabled>Select Industry</option>
                  {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
                </div>
                {/* Job Role Selection */}
                <div>
                <label className="block text-white mb-2">Job Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Software Engineer, Data Scientist" 
                  className="w-full p-3 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-[#0b0f1c] text-white"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                />
                </div>
              
                <div>
                <label className="block text-white mb-2">Level of Experience</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                  <button
                    key={level}
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                    experienceLevel === level 
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-500/30 border-white' 
                      : 'border-gray-800 hover:bg-[#1a1f2e]'
                    }`}
                    onClick={() => setExperienceLevel(level)}
                  >
                    <div className={`mb-2 ${experienceLevel === level ? 'text-white' : 'text-gray-400'}`}>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    )}
                    </div>
                    <span className={`text-sm ${experienceLevel === level ? 'text-white' : 'text-gray-400'}`}>
                    {level}
                    </span>
                  </button>
                  ))}
                </div>
                </div>
                   
                <div>
                <label className="block text-white mb-2">Preferred Question Difficulty</label>
                <select 
                  className="w-full p-3 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white bg-[#0b0f1c] text-white"
                  value={questionDifficulty}
                  onChange={(e) => setQuestionDifficulty(e.target.value)}
                >
                  <option value="" disabled>Select Difficulty</option>
                  {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                </div>
                {/* Start Button */}
          <button 
            className={`w-full py-3 px-4 ${
              isFormValid()
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600'
                : 'bg-gray-700 cursor-not-allowed'
            } text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors`}
            onClick={() => {
              if (isFormValid()) {
                console.log('Navigating to /startmock');
                window.location.href = '/startmock';
              }
            }}
            disabled={!isFormValid()}
          >
            Start Mock Interview
          </button>
        </div>
      </div>
     
 
    </div>
  );
};

export default InterviewAI;