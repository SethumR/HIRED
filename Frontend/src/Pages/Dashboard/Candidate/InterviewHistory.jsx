"use client"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileDown, Filter, ChevronRight, Download } from "lucide-react";
import Sidebar from "./SideBar";  // Importing your custom Sidebar component

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
];

// Define user profile for the sidebar
const userProfile = {
  name: "Sarah Wilson",
  title: "Software Engineer",
  initials: "SW",
};

// Score badge component to match the Dashboard style
const ScoreBadge = ({ score }) => {
  let color = "green";
  if (score < 60) color = "red";
  else if (score < 80) color = "yellow";

  const colorClasses = {
    green: "bg-green-900/50 text-green-400 border border-green-600/30",
    yellow: "bg-yellow-900/50 text-yellow-400 border border-yellow-600/30",
    red: "bg-red-900/50 text-red-400 border border-red-600/30",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}>
      {score}%
    </span>
  );
};

const InterviewHistory = () => {
  const [filterStatus, setFilterStatus] = useState("All Interviews");

  // Filter interviews based on selected status
  const filteredInterviews = interviewHistory.filter((interview) => {
    if (filterStatus === "All Interviews") return true;
    if (filterStatus === "High Scores" && interview.score >= 80) return true;
    if (filterStatus === "Medium Scores" && interview.score >= 60 && interview.score < 80) return true;
    if (filterStatus === "Low Scores" && interview.score < 60) return true;
    return false;
  });

  return (
    <div className="flex min-h-screen bg-[#0b0f1c] text-white font-sans">
      {/* Include the Sidebar component */}
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 container mx-auto pt-36 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Interview History
              </h1>
              <p className="text-gray-400 mt-1">View and analyze your past interview results</p>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-lg px-4 py-2.5 text-sm text-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option>All Interviews</option>
                  <option>High Scores</option>
                  <option>Medium Scores</option>
                  <option>Low Scores</option>
                </select>
                <Filter className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <button className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium transition-transform duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Export Results
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-hidden rounded-xl shadow-lg border border-purple-500/20">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-900 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Job Industry
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Job Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Experience Level
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-800/30">
                  {filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                      <tr key={interview.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-white">{interview.industry}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-300">{interview.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-300">{interview.experience}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-300">{interview.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ScoreBadge score={interview.score} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/interviews/${interview.id}`}
                              className="text-white hover:text-purple-300 transition-colors flex items-center gap-1"
                            >
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                            <button className="text-white hover:text-purple-300 transition-colors flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                        No interviews found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewHistory;