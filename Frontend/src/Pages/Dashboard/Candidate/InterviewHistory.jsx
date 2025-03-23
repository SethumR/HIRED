import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDownToLine, ChevronRight, Download, FileDown, Search } from 'lucide-react';
import Sidebar from "./SideBar";  // Importing your custom Sidebar component

// Score badge component with modern styling
const ScoreBadge = ({ score }) => {
  let variant = "success";
  
  if (score < 60) {
    variant = "danger";
  } else if (score < 80) {
    variant = "warning";
  }

  const variantStyles = {
    success: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    danger: "bg-rose-500/15 text-rose-500 border-rose-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${variantStyles[variant]}`}>
      {score}%
    </span>
  );
};

const InterviewHistory = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [interviewHistory, setInterviewHistory] = useState([]);

  useEffect(() => {
    // Load interview history from localStorage
    const loadInterviewHistory = () => {
      const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      setInterviewHistory(history);
    };

    loadInterviewHistory();

    // Listen for new interview completions
    window.addEventListener('interviewCompleted', loadInterviewHistory);

    return () => {
      window.removeEventListener('interviewCompleted', loadInterviewHistory);
    };
  }, []);

  // Function to save a new interview session
  const saveInterviewSession = (sessionData) => {
    const currentHistory = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
    const newSession = {
      id: Date.now(),
      industry: sessionData.industry,
      role: sessionData.designation,
      experience: sessionData.experience,
      date: new Date().toLocaleDateString(),
      score: sessionData.percentageScore,
    };
    
    const updatedHistory = [newSession, ...currentHistory];
    localStorage.setItem('interviewHistory', JSON.stringify(updatedHistory));
    setInterviewHistory(updatedHistory);
  };

  // Filter interviews based on selected status and search query
  const filteredInterviews = interviewHistory.filter((interview) => {
    // Filter by score category
    if (filterStatus === "high" && interview.score < 80) return false;
    if (filterStatus === "medium" && (interview.score < 60 || interview.score >= 80)) return false;
    if (filterStatus === "low" && interview.score >= 60) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        interview.industry?.toLowerCase().includes(query) ||
        interview.role?.toLowerCase().includes(query) ||
        interview.experience?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#0b0f1c] text-gray-100">
      <Sidebar />
      
      <div className="flex-1">
        <main className="container mx-auto py-36 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Interview History
              </h1>
              <p className="text-gray-400 mt-1">View and analyze your past interview results</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="sm:w-auto w-full px-4 py-2 border border-gray-700 rounded-lg text-gray-300  hover:bg-[#232837] flex items-center justify-center gap-2">
                <ArrowDownToLine className="h-4 w-4" />
                Export CSV
              </button>
              <button className="sm:w-auto w-full px-4 py-2  border border-gray-700 hover:bg-[#232837] text-white rounded-lg flex items-center justify-center gap-2">
                <FileDown className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>

          <div className=" rounded-lg shadow-sm border border-gray-800 mb-8">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold text-lg">Filter Interviews</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by role, industry or experience..."
                    className="pl-9 w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#0b0f1c] text-gray-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="w-full sm:w-[180px] px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[#0b0f1c] text-gray-100"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Scores</option>
                  <option value="high">High Scores (80+)</option>
                  <option value="medium">Medium Scores (60-79)</option>
                  <option value="low">Low Scores (&lt;60)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="mb-6 border-b border-gray-700">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("table")}
                  className={`px-1 py-2 font-medium text-sm ${
                    activeTab === "table"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent border-b-2 border-purple-600"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setActiveTab("grid")}
                  className={`px-1 py-2 font-medium text-sm ${
                    activeTab === "grid"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent border-b-2 border-purple-600"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Grid View
                </button>
              </div>
            </div>
            
            {activeTab === "table" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-800 overflow-hidden bg-gray-900/10">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-900/50">
                          <th className="px-6 py-5 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Job Industry
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Job Role
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Experience Level
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredInterviews.length > 0 ? (
                          filteredInterviews.map((interview) => (
                            <tr key={interview.id} className="hover:bg-gray-900/80 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-100">{interview.industry}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-100">{interview.role}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-100">{interview.experience}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-400">{interview.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ScoreBadge score={interview.score} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-4">
                                  <Link
                                    to={`/interviews/${interview.id}`}
                                    className="text-white bg-clip-text text-transparent font-medium flex items-center gap-1"
                                  >
                                    View Details
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                  </Link>
                                  <button className="text-gray-400 hover:text-gray-200 flex items-center gap-1">
                                    <Download className="mr-1 h-4 w-4" />
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                              No interviews found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "grid" && (
              <div className="space-y-4">
                {filteredInterviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInterviews.map((interview) => (
                      <div key={interview.id} className="bg-gray-900/10 rounded-lg border border-gray-800 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-800">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-100">{interview.role}</h3>
                              <p className="text-sm text-gray-400">{interview.industry}</p>
                            </div>
                            <ScoreBadge score={interview.score} />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Experience:</span>
                              <span className="text-gray-100">{interview.experience}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Date:</span>
                              <span className="text-gray-100">{interview.date}</span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Link
                              to={`/interviews/${interview.id}`}
                              className="px-3 py-1.5 border border-gray-700 text-gray-300 rounded-md text-sm font-medium hover:bg-[#232837]"
                            >
                              View Details
                            </Link>
                            <button className="px-3 py-1.5 text-gray-400 text-sm font-medium flex items-center gap-1 hover:text-gray-200">
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400 bg-[#1a1f2e] rounded-lg border border-gray-700">
                    No interviews found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewHistory;