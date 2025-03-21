"use client"

import { useEffect, useState } from "react"
import { Camera, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function EditProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [newSkill, setNewSkill] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user")
    const storedProfileData = localStorage.getItem("profileData")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedProfileData) {
      setProfileData(JSON.parse(storedProfileData))
    }
  }, [])

  const [profileData, setProfileData] = useState({
    fullName: "John Anderson",
    currentRole: "Senior Software Engineer",
    industry: "Technology",
    yearsOfExperience: "5 Years",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johnanderson.dev",
    summary: "Experienced software engineer with a strong background in full-stack development and cloud architecture.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
  })

  const handleSave = () => {
    // Save profile data to localStorage
    localStorage.setItem("profileData", JSON.stringify(profileData))
    console.log("Saving profile:", profileData)
    setSaveSuccess(true)

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false)
    }, 3000)
  }

  const handleFileUpload = (e) => {
    console.log("File uploaded:", e.target.files?.[0])
    // Here you would typically handle the file upload
  }

  const addSkill = () => {
    if (newSkill.trim() !== "" && !profileData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...profileData.skills, newSkill.trim()]
      setProfileData({ ...profileData, skills: updatedSkills })
      setNewSkill("")
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f1c] text-white py-32">
      <div className="max-w-[77rem] mx-auto px-4">
        {/* Back to Dashboard Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6">Edit Your Profile</h1>
        <p className="text-gray-400 text-base mb-8">Update your personal information and professional details.</p>
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <p className="text-green-400 font-medium flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Your changes have been saved successfully!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Basic Info with Profile Image */}
          <div className="space-y-6">
            <div className="space-y-4 bg-[#101827] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Basic Information</h3>

              {/* Profile Image */}
              <div className="flex justify-center items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-gray-700 bg-[#0b0f1c] flex justify-center items-center overflow-hidden">
                    <span className="text-gray-400 text-sm">Profile</span>
                  </div>
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 p-2 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    type="file"
                    id="profile-photo"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <label
                  htmlFor="profile-photo"
                  className="text-gray-400 text-sm hover:text-white transition duration-300 cursor-pointer"
                >
                  Change Photo
                </label>
              </div>

              {[
                { label: "Full Name", key: "fullName" },
                { label: "Current Role", key: "currentRole" },
                { label: "Industry", key: "industry" },
                { label: "Years of Experience", key: "yearsOfExperience" },
              ].map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={profileData[field.key]}
                    onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                    className="w-full p-2 bg-[#0b0f1c] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Info, Resume, and Skills */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#101827] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Email", key: "email" },
                  { label: "Phone", key: "phone" },
                  { label: "Location", key: "location" },
                  { label: "Website", key: "website" },
                ].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                    <input
                      type="text"
                      value={profileData[field.key]}
                      onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                      className="w-full p-2 bg-[#0b0f1c] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#101827] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Professional Summary
              </h3>
              <div>
                <textarea
                  value={profileData.summary}
                  onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                  className="w-full p-3 bg-[#0b0f1c] border border-gray-700 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="bg-[#101827] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-[#0b0f1c] text-white border border-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-1 p-2 bg-[#0b0f1c] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white transition-all duration-200"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="bg-[#101827] p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Resume</h3>
              <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-[#0b0f1c]">
                <input
                  type="file"
                  id="resume"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-[#101827] rounded-full border border-gray-700">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Drag and drop your resume here or</p>
                    <p className="text-sm text-blue-500">browse files</p>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-lg text-white border border-gray-700 hover:bg-[#101827] transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-300 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}