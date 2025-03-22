"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Loader2, Check, Trash2, Plus, ChevronRight, ChevronLeft, Copy, ChevronDown } from "lucide-react"

const jobRoles = ["Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "Marketing Specialist"]
const interviewTypes = ["Technical", "Behavioral", "System Design", "Case Study", "Mixed"]
const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead", "Principal"]

export default function JobRolesSetupPage() {
  const [step, setStep] = useState(1)
  const [interviewLink, setInterviewLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    interviewType: "",
    experienceLevel: "",
    questions: [{ question: "", answer: "" }],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[index][field] = value
    setFormData((prev) => ({ ...prev, questions: newQuestions }))
  }

  const addQuestion = () => {
    setFormData((prev) => ({ ...prev, questions: [...prev.questions, { question: "", answer: "" }] }))
  }

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, questions: newQuestions }))
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const generateInterviewLink = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setInterviewLink(`https://interview.ai/${Math.random().toString(36).substr(2, 9)}`)
    }, 3000)
  }

  const copyToClipboard = () => {
    if (navigator.clipboard && interviewLink) {
      navigator.clipboard.writeText(interviewLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  // Progress steps configuration
  const progressSteps = [
    { 
      number: 1, 
      title: "Define Parameters", 
      description: "Start by setting up the basic details for your interview."
    },
    { 
      number: 2, 
      title: "Create Questions", 
      description: "Add and customize the questions for your interview."
    },
    { 
      number: 3, 
      title: "Review & Generate", 
      description: "Review your setup and generate the interview link."
    }
  ]

  return (
    <div className="min-h-screen bg-[#0b0f1c]">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-purple-500/20 py-4 sticky top-0 z-10">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Job Role & Interview Setup</h1>
          <Link
            to="/companydashboard"
            className="flex items-center px-4 py-2 rounded-md bg-gray-800/80 text-purple-300 hover:text-white hover:bg-purple-600 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 mt-16">
        {/* Progress Steps */}
        <div className="flex justify-between max-w-4xl mx-auto mb-10">
          {progressSteps.map((stepItem) => (
            <div 
              key={stepItem.number} 
              className="flex flex-col items-center text-center w-full max-w-xs px-2"
            >
              <div className={`w-full bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 mb-4 transition-all duration-300 border border-purple-500/20 ${step === stepItem.number ? 'shadow-lg shadow-violet-900/20' : ''}`}>
                <h3 className="text-sm text-gray-400 font-medium mb-1">
                  Step {stepItem.number}
                </h3>
                <p className={`font-bold mb-2 ${step === stepItem.number ? 'text-white' : 'text-gray-400'}`}>
                  {stepItem.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Define Interview Parameters</h2>
                  <p className="text-gray-400">Start by setting up the basic details for your interview.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Job Role", name: "title", options: jobRoles },
                    { label: "Interview Type", name: "interviewType", options: interviewTypes },
                    { label: "Experience Level", name: "experienceLevel", options: experienceLevels },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">{field.label}</label>
                      <div className="relative">
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full p-3 pl-4 pr-10 rounded-lg bg-[#0b0f1c] text-white border border-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all appearance-none"
                        >
                          <option value="">Select {field.label.toLowerCase()}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!formData.title || !formData.interviewType || !formData.experienceLevel}
                  className={`flex items-center px-6 py-3 rounded-lg shadow-lg transition-all duration-200 font-medium ${
                    !formData.title || !formData.interviewType || !formData.experienceLevel
                      ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                      : "bg-violet-900/30 border border-violet-500/30 text-white hover:bg-violet-800/40 hover:border-violet-400/40 hover:shadow-violet-900/20 hover:shadow-xl"
                  }`}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Define Interview Questions</h2>
                  <p className="text-gray-400">Add and customize the questions for your interview.</p>
                </div>

                <div className="space-y-5">
                  {formData.questions.map((q, index) => (
                    <div
                      key={index}
                      className="bg-[#0b0f1c] border border-white/10 rounded-xl p-5 shadow-lg transition-all hover:border-white/20"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-violet-900/30 flex items-center justify-center mr-3 border border-violet-500/30">
                            <span className="text-violet-300 font-medium text-sm">{index + 1}</span>
                          </div>
                          <h3 className="font-medium text-white">Question {index + 1}</h3>
                        </div>
                        <button
                          onClick={() => removeQuestion(index)}
                          disabled={formData.questions.length === 1}
                          className={`p-2 rounded-full transition-all ${
                            formData.questions.length === 1
                              ? "text-gray-500 cursor-not-allowed"
                              : "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                          }`}
                          aria-label="Remove question"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-gray-400 mb-1 text-sm">Question</label>
                          <input
                            type="text"
                            placeholder="E.g., Describe a challenging project you've worked on..."
                            value={q.question}
                            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#0b0f1c]/60 border border-white/20 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-400 mb-1 text-sm">Model Answer</label>
                          <textarea
                            placeholder="Provide a sample answer or evaluation criteria..."
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                            rows={3}
                            className="w-full p-3 rounded-lg bg-[#0b0f1c]/60 border border-white/20 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addQuestion}
                    className="w-full p-3 border border-dashed border-white/20 rounded-xl text-gray-400 hover:text-violet-300 hover:border-violet-500/50 flex items-center justify-center transition-all"
                  >
                    <Plus size={16} className="mr-2" /> Add Another Question
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 bg-[#0b0f1c] border border-white/10 text-white rounded-lg hover:bg-[#101624] shadow-md transition-all font-medium"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={formData.questions.some((q) => !q.question.trim())}
                  className={`flex items-center px-6 py-3 rounded-lg shadow-lg transition-all font-medium ${
                    formData.questions.some((q) => !q.question.trim())
                      ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                      : "bg-violet-900/30 border border-violet-500/30 text-white hover:bg-violet-800/40 hover:border-violet-400/40 hover:shadow-violet-900/20 hover:shadow-xl"
                  }`}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Generate */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Review & Generate Interview</h2>
                  <p className="text-gray-400">Review your setup and generate the interview link.</p>
                </div>

                <h3 className="text-lg font-medium text-violet-300 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-violet-900/30 flex items-center justify-center mr-3 border border-violet-500/30 text-sm">
                    <Check className="w-4 h-4" />
                  </span>
                  Interview Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#0b0f1c] p-4 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Job Role</p>
                    <p className="text-white font-medium">{formData.title}</p>
                  </div>
                  <div className="bg-[#0b0f1c] p-4 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Interview Type</p>
                    <p className="text-white font-medium">{formData.interviewType}</p>
                  </div>
                  <div className="bg-[#0b0f1c] p-4 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Experience Level</p>
                    <p className="text-white font-medium">{formData.experienceLevel}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-medium text-violet-300 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-violet-900/30 flex items-center justify-center mr-3 border border-violet-500/30 text-sm">
                        <Check className="w-4 h-4" />
                      </span>
                      Questions
                    </h3>
                    <span className="ml-2 bg-violet-900/30 text-violet-300 text-xs px-2 py-1 rounded-full border border-violet-500/30">
                      {formData.questions.length}
                    </span>
                  </div>

                  <div className="mt-2 space-y-3">
                    {formData.questions.map((q, idx) => (
                      <details
                        key={idx}
                        className="group bg-[#0b0f1c] rounded-lg border border-white/10 overflow-hidden"
                      >
                        <summary className="flex items-center text-white cursor-pointer list-none p-4">
                          <div className="w-6 h-6 rounded-full bg-violet-900/30 flex items-center justify-center mr-3 text-xs text-violet-300 border border-violet-500/30">
                            {idx + 1}
                          </div>
                          <span className="text-sm">
                            {q.question.substring(0, 60)}
                            {q.question.length > 60 ? "..." : ""}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-auto transform group-open:rotate-180 transition-transform text-gray-400" />
                        </summary>
                        <div className="pl-12 pr-4 pb-4 text-sm text-gray-400">
                          {q.answer || "No model answer provided."}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                {interviewLink && (
                  <div className="mt-8 p-4 bg-violet-900/20 border border-violet-500/30 rounded-lg">
                    <p className="text-sm text-violet-300 mb-2">Interview Link</p>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={interviewLink}
                        readOnly
                        className="flex-1 p-3 rounded-l-lg bg-[#0b0f1c] text-white border border-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="p-3 rounded-r-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                      >
                        {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 bg-[#0b0f1c] border border-white/10 text-white rounded-lg hover:bg-[#101624] shadow-md transition-all font-medium"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </button>
                {!interviewLink ? (
                  <button
                    onClick={generateInterviewLink}
                    disabled={isGenerating}
                    className="flex items-center px-6 py-3 bg-violet-900/30 border border-violet-500/30 text-white rounded-lg hover:bg-violet-800/40 hover:border-violet-400/40 shadow-lg transition-all font-medium disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>Generate Interview</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Handle publish or save functionality
                      alert("Interview published successfully!")
                    }}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-all font-medium"
                  >
                    Publish Interview
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}