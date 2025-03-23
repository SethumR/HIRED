import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSpinner, FaCheck, FaTrash, FaPlus } from "react-icons/fa";

const jobRoles = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "Marketing Specialist"];
const interviewTypes = ["Technical", "Behavioral", "System Design", "Case Study", "Mixed"];
const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead", "Principal"];

export default function JobRolesSetupPage() {
  const [step, setStep] = useState(1);
  const [interviewLink, setInterviewLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    interviewType: "",
    experienceLevel: "",
    questions: [{ question: "", answer: "" }],
  });

  useEffect(() => {
    if (step === 3) {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setInterviewLink(`https://interview.ai/${Math.random().toString(36).substr(2, 9)}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleQuestionChange(index, field, value) {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  }

  function addQuestion() {
    setFormData((prev) => ({ ...prev, questions: [...prev.questions, { question: "", answer: "" }] }));
  }

  function removeQuestion(index) {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  }

  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0b0f1c] to-[#1a1f2e] p-6">
      <main className="flex-1 container mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-10 relative">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            Job Role & Interview Setup
          </h1>
          <div className="absolute right-0 top-0">
            <Link to="/companydashboard" className="flex items-center px-4 py-2 rounded-md bg-gray-800 text-purple-400 hover:text-purple-300 hover:bg-gray-700 transition-colors shadow-md">
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="flex justify-center w-full mb-10">
          <div className="w-2/3 flex space-x-4">
            {[1, 2, 3].map((s) => (
              <button 
                key={s} 
                className={`px-6 py-3 rounded-lg flex-1 transition-all font-medium ${
                  s === step 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`} 
                onClick={() => setStep(s)}
              >
                Step {s}
                <span className="block text-sm mt-1 opacity-75">{s === 1 ? 'Basic Info' : s === 2 ? 'Questions' : 'Review'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-2/3">
            {step === 1 && (
              <div className="border border-gray-700 p-8 rounded-lg bg-gray-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
                  Step 1: Define Interview Parameters
                </h2>
                <label className="block text-white mb-2 font-medium">Job Role</label>
                <select 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">Select a role</option>
                  {jobRoles.map((role) => (<option key={role} value={role}>{role}</option>))}
                </select>

                <label className="block text-white mb-2 font-medium">Interview Type</label>
                <select 
                  name="interviewType" 
                  value={formData.interviewType} 
                  onChange={handleChange} 
                  className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">Select interview type</option>
                  {interviewTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>

                <label className="block text-white mb-2 font-medium">Experience Level</label>
                <select 
                  name="experienceLevel" 
                  value={formData.experienceLevel} 
                  onChange={handleChange} 
                  className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map((level) => (<option key={level} value={level}>{level}</option>))}
                </select>
                
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setStep(2)} 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 shadow-md transition-all font-medium"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="border border-gray-700 p-8 rounded-lg bg-gray-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
                  Step 2: Define Interview Questions
                </h2>
                {formData.questions.map((q, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-800 rounded-md border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-400 font-medium">Question {index + 1}</span>
                      <button 
                        onClick={() => removeQuestion(index)} 
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-gray-700 rounded-full transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Question" 
                      value={q.question} 
                      onChange={(e) => handleQuestionChange(index, "question", e.target.value)} 
                      className="w-full p-3 mb-3 rounded-md bg-gray-900 text-white border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    />
                    <textarea 
                      placeholder="Model Answer" 
                      value={q.answer} 
                      onChange={(e) => handleQuestionChange(index, "answer", e.target.value)} 
                      className="w-full p-3 rounded-md bg-gray-900 text-white min-h-24 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                    ></textarea>
                  </div>
                ))}
                <button 
                  onClick={addQuestion} 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center shadow-md transition-all"
                >
                  <FaPlus className="mr-2" /> Add Question
                </button>
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handlePrevious} 
                    className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 shadow-md transition-all font-medium"
                  >
                    Previous Step
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 shadow-md transition-all font-medium"
                  >
                    Review & Generate
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="border border-gray-700 p-8 rounded-lg bg-gray-900 shadow-xl backdrop-blur-sm bg-opacity-90">
                <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">
                  Step 3: Review & Generate Interview
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border border-gray-700 rounded-lg bg-gray-800 shadow-md">
                      <h3 className="text-lg font-medium text-purple-400 mb-3">Interview Details</h3>
                      <p className="text-white font-medium">Role: <span className="text-gray-300 font-normal">{formData.title || "Not specified"}</span></p>
                      <p className="text-white font-medium">Type: <span className="text-gray-300 font-normal">{formData.interviewType || "Not specified"}</span></p>
                      <p className="text-white font-medium">Level: <span className="text-gray-300 font-normal">{formData.experienceLevel || "Not specified"}</span></p>
                    </div>
                    <div className="p-5 border border-gray-700 rounded-lg bg-gray-800 shadow-md">
                      <h3 className="text-lg font-medium text-purple-400 mb-3">Questions Summary</h3>
                      <p className="text-white font-medium">Total: <span className="text-gray-300 font-normal">{formData.questions.length} questions defined</span></p>
                      <p className="text-white font-medium">Status: <span className="text-green-400 font-normal">Ready to generate</span></p>
                    </div>
                  </div>
                  {isGenerating ? (
                    <div className="text-center py-10">
                      <FaSpinner className="animate-spin text-purple-500 text-4xl mx-auto mb-4" />
                      <p className="text-gray-300">Generating your interview setup...</p>
                      <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                    </div>
                  ) : interviewLink ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 bg-opacity-20 mb-2">
                        <FaCheck className="text-green-500 text-2xl" />
                      </div>
                      <p className="text-white text-xl">Your interview has been generated!</p>
                      <p className="text-gray-400">Share the link with candidates or start the interview now</p>
                      <a 
                        href={interviewLink} 
                        className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-md font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                      >
                        Start Interview
                      </a>
                      <button className="mt-2 text-purple-400 hover:text-purple-300 text-sm">
                        Copy interview link
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-start mt-8">
                  <button 
                    onClick={handlePrevious} 
                    className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 shadow-md transition-all font-medium"
                  >
                    Previous Step
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}