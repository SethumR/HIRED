import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Linkedin, Github, Twitter, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [profileData, setProfileData] = useState({
    fullName: "John Anderson",
    currentRole: "Senior Software Engineer",
    industry: "Technology",
    yearsOfExperience: "5 Years",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://johnanderson.dev",
    summary:
      "Experienced software engineer with a strong background in full-stack development and cloud architecture.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnanderson",
      github: "https://github.com/johnanderson",
      twitter: "https://twitter.com/johnanderson",
    },
  });

  const handleSave = () => {
    console.log("Saving profile:", profileData);
    navigate("/dashboard");
  };

  const handleFileUpload = (e) => {
    console.log("File uploaded:", e.target.files?.[0]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f1c] text-white py-[85px]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-[#0d1221] px-6 py-4 mb-5">
        <div className="flex items-center gap-3">
          <img
            src="Sethum.png"
            alt="Profile"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-white">{user ? user.name : profileData.fullName}</h2>
            <p className="text-sm text-gray-400">{user ? user.email : profileData.email}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center gap-2 text-gray-400 hover:text-purple-500"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Dashboard
        </button>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
          Edit Your Profile
        </h1>
        <p className="text-gray-400 text-base mb-8">
          Update your personal information and professional details.
        </p>

        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-400">Profile Completion</span>
            <span className="text-sm text-purple-500">85%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="space-y-6">
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-purple-500 bg-[#0d1221] flex justify-center items-center overflow-hidden">
                  <span className="text-white text-sm">Profile</span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <button className="text-purple-500 text-sm hover:text-pink-500 transition duration-300">
                Change Photo
              </button>
            </div>

            <div className="space-y-4 bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Basic Information
              </h3>
              {[
                { label: "Full Name", key: "fullName" },
                { label: "Current Role", key: "currentRole" },
                { label: "Industry", key: "industry" },
                { label: "Years of Experience", key: "yearsOfExperience" }
              ].map((field, index) => (
                <div key={index}>
                  <label className="text-sm text-gray-400">{field.label}</label>
                  <input
                    type="text"
                    value={profileData[field.key]}
                    onChange={(e) =>
                      setProfileData({ ...profileData, [field.key]: e.target.value })
                    }
                    className="w-full p-2 bg-[#0b0f1c] border border-gray-800 rounded-lg mt-1 focus:outline-none focus:border-purple-500 text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Info, Resume, and Social Links */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Email", key: "email" },
                  { label: "Phone", key: "phone" },
                  { label: "Location", key: "location" },
                  { label: "Website", key: "website" }
                ].map((field, index) => (
                  <div key={index}>
                    <label className="text-sm text-gray-400">{field.label}</label>
                    <input
                      type="text"
                      value={profileData[field.key]}
                      onChange={(e) =>
                        setProfileData({ ...profileData, [field.key]: e.target.value })
                      }
                      className="w-full p-2 bg-[#0b0f1c] border border-gray-800 rounded-lg mt-1 focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Professional Summary
              </h3>
              <div>
                <textarea
                  value={profileData.summary}
                  onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                  className="w-full p-3 bg-[#0b0f1c] border border-gray-800 rounded-lg h-32 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
            </div>

            <div className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-[#0b0f1c] text-purple-500 border border-purple-500 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-gray-600 rounded-full text-sm text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors">
                  + Add Skill
                </button>
              </div>
            </div>

            <div className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Resume
              </h3>
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
                    <div className="p-4 bg-[#0d1221] rounded-full border border-gray-700">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">Drag and drop your resume here or</p>
                    <p className="text-sm text-purple-500">browse files</p>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Social Links
              </h3>
              <div className="space-y-3">
                {[
                  { platform: "linkedin", icon: <Linkedin className="w-5 h-5 text-purple-500" /> },
                  { platform: "github", icon: <Github className="w-5 h-5 text-purple-500" /> },
                  { platform: "twitter", icon: <Twitter className="w-5 h-5 text-purple-500" /> }
                ].map((item) => (
                  <div key={item.platform} className="flex items-center space-x-2">
                    {item.icon}
                    <input
                      type="text"
                      value={profileData.socialLinks[item.platform]}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          socialLinks: { ...profileData.socialLinks, [item.platform]: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-[#0b0f1c] border border-gray-800 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button 
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-xl text-white border border-gray-700 hover:bg-[#0d1221] transition duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}