"use client"
import React, { useState } from "react"
import { Link } from "react-router-dom"

const colors = {
  background: "#0b0f1c",
  foreground: "#fdfdfd",
  card: "#0a2635",
  border: "#1a3545",
  purplePinkFrom: "#8B5CF6",
  purplePinkTo: "#EC4899",
  accentPurple: "#9333EA",
  accentPink: "#EC4899",
}

const userProfile = {
  name: "Sarah Wilson",
  title: "Software Engineer",
  initials: "SW",
}

// Update the mock data dates to numeric format
const interviewHistory = [
  {
    id: 1,
    industry: "Technology",
    role: "Frontend Developer",
    experience: "Senior",
    date: "06/15/2023",
    score: 87,
  },
  {
    id: 2,
    industry: "Finance",
    role: "Full Stack Engineer",
    experience: "Mid-level",
    date: "05/28/2023",
    score: 72,
  },
  {
    id: 3,
    industry: "Healthcare",
    role: "React Developer",
    experience: "Junior",
    date: "05/10/2023",
    score: 91,
  },
  {
    id: 4,
    industry: "E-commerce",
    role: "Software Engineer",
    experience: "Mid-level",
    date: "04/22/2023",
    score: 65,
  },
  {
    id: 5,
    industry: "Education",
    role: "Frontend Architect",
    experience: "Senior",
    date: "04/05/2023",
    score: 89,
  },
]

const InterviewHistory = () => {
  const [filterStatus, setFilterStatus] = useState("All Interviews")

  // Filter interviews based on selected status
  const filteredInterviews = interviewHistory.filter((interview) => {
    if (filterStatus === "All Interviews") return true
    if (filterStatus === "High Scores" && interview.score >= 80) return true
    if (filterStatus === "Medium Scores" && interview.score >= 60 && interview.score < 80) return true
    if (filterStatus === "Low Scores" && interview.score < 60) return true
    return false
  })

  return (
    <div className="flex h-screen text-white font-sans bg-[#0b0f1c]" style={{ marginTop: "6rem" }}>
      <aside className="w-64 h-full  p-4 flex flex-col max-h-screen overflow-y-auto border-r border-opacity-30 border-white">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl mr-4 mt-6">
            {userProfile.initials}
          </div>
          <div>
            <h3 className="font-semibold mt-6">{userProfile.name}</h3>
            <p className="text-gray-400 text-sm">{userProfile.title}</p>
          </div>
        </div>
        <nav className="flex-1 mb-6 ">
          {["Dashboard", "Start Mock Interview", "Interview History", "Generate Script", "Settings"].map(
            (item, index) => (
              <Link
                key={item}
                to={
                  item === "Dashboard" ? "/dashboard" :
                  item === "Start Mock Interview" ? "/startmock" :
                  item === "Interview History" ? "/interview-history" :
                  item === "Generate Script" ? "/uploadcv" :
                  item === "Settings" ? "/editprofile" : "#"
                }
                className={`block px-4 py-3 mb-2 rounded-md transition-colors font-medium text-base tracking-wide ${
                  index === 2
                    ? "bg-[#1e293b] text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {item}
              </Link>
            ),
          )}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 mt-6">
          <h1 className="text-2xl font-bold text-white">Interview History</h1>
          <div className="flex gap-3">
            <select
              className="bg-[#0a2635] border border-[#1a3545] rounded-md px-3 py-2 text-sm text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Interviews</option>
              <option>High Scores</option>
              <option>Medium Scores</option>
              <option>Low Scores</option>
            </select>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-md text-sm font-medium text-white">
              Export Results
            </button>
          </div>
        </div>

        <div className="bg-[#0a2635] rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a3545]">
                <th className="text-left p-4 font-medium text-white">Job Industry</th>
                <th className="text-left p-4 font-medium text-white">Job Role</th>
                <th className="text-left p-4 font-medium text-white">Experience Level</th>
                <th className="text-left p-4 font-medium text-white">Date</th>
                <th className="text-left p-4 font-medium text-white">Score</th>
                <th className="text-left p-4 font-medium text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((interview) => (
                  <tr key={interview.id} className="border-b border-[#1a3545] hover:bg-[#0d2c3d] transition-colors">
                    <td className="p-4 text-white">{interview.industry}</td>
                    <td className="p-4 text-white">{interview.role}</td>
                    <td className="p-4 text-white">{interview.experience}</td>
                    <td className="p-4 text-white">{interview.date}</td>
                    <td className="p-4 text-white">{interview.score}%</td>
                    <td className="p-4 text-white flex gap-3">
                      <button className="text-sm text-white hover:text-purple-300">View Details</button>
                      <button className="text-sm text-white hover:text-purple-300">Download</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white">
                    No interviews found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default InterviewHistory

