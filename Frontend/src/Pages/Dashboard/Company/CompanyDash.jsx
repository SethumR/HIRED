import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  PieChart,
  Settings,
  Users,
  FileText,
  PlusCircle,
  Menu,
  BarChart4,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";

// Static Data
const dashboardStatsData = [
  {
    title: "Total Interviews",
    value: "128",
    progress: 75,
    description: "75% completed",
    icon: <BarChart4 className="h-6 w-6 text-purple-400" />,
    color: "purple",
  },
  {
    title: "Active Interviews",
    value: "32",
    description: "12 in progress",
    icon: <Clock className="h-6 w-6 text-purple-400" />,
    color: "purple",
  },
  {
    title: "Completed Interviews",
    value: "96",
    description: "24 new reports available",
    icon: <CheckCircle className="h-6 w-6 text-purple-400" />,
    color: "purple",
  },
  {
    title: "Upcoming Interviews",
    value: "18",
    description: "5 scheduled for today",
    icon: <Calendar className="h-6 w-6 text-purple-400" />,
    color: "purple",
  },
];

const candidatesData = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Software Engineer",
    status: "Completed",
    score: "85%",
    statusColor: "green",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Product Manager",
    status: "In Progress",
    score: "N/A",
    statusColor: "blue",
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "UX Designer",
    status: "Scheduled",
    score: "N/A",
    statusColor: "yellow",
  },
  {
    id: 4,
    name: "Diana Lee",
    role: "Data Analyst",
    status: "Completed",
    score: "92%",
    statusColor: "green",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    role: "Marketing Specialist",
    status: "In Progress",
    score: "N/A",
    statusColor: "blue",
  },
];

const actionsData = [
  {
    title: "Create New Interview",
    description: "Set up a new candidate assessment",
    link: "/jobrolesetuppage",
    icon: <PlusCircle className="h-5 w-5 text-white" />,
    buttonText: "Start"
  },
  {
    title: "View Reports",
    description: "Analyze candidate performance",
    link: "/reportperformancepage",
    icon: <FileText className="h-5 w-5 text-white" />,
    buttonText: "Open"
  },
];

// Status badge component
const StatusBadge = ({ status, color }) => {
  const colorClasses = {
    green: "bg-green-900/50 text-green-400 border border-green-600/30",
    blue: "bg-blue-900/50 text-blue-400 border border-blue-600/30",
    yellow: "bg-yellow-900/50 text-yellow-400 border border-yellow-600/30",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {status}
    </span>
  );
};

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f1c] text-white font-sans">
      {/* Main Content */}
      <main className="flex-1 container mx-auto pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">Welcome back to your interview system</p>
          </div>
          
          {/* Hamburger Menu */}
          <div className="relative inline-block text-right">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Menu dropdown */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-gray-900 ring-1 ring-purple-500/20 focus:outline-none z-10 divide-y divide-gray-700/50"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1" role="none">
                  {[{
                    title: "Settings and Terms",
                    icon: <Settings className="h-5 w-5 text-purple-400" />,
                    link: "/settings"
                  },
                  {
                    title: "Profile",
                    icon: <Users className="h-5 w-5 text-purple-400" />,
                    link: "/CompanyProfilePage"
                  }].map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-purple-400 transition-colors"
                      role="menuitem"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStatsData.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex flex-col justify-between transition duration-300 hover:translate-y-1 hover:shadow-xl border border-purple-500/20"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
                  <div className="p-2 rounded-lg bg-purple-900/30">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </div>
              {stat.progress && (
                <div className="mt-4">
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${stat.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
                </div>
              )}
              {!stat.progress && stat.description && (
                <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Candidate Submissions Table */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Recent Candidate Submissions
            </h2>
            <Link to="/candidates" className="text-white hover:text-purple-300 text-sm font-medium transition-colors">
              View all candidates
            </Link>
          </div>
          
          <div className="overflow-hidden rounded-xl shadow-lg border border-purple-500/20">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-900 text-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Candidate Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Job Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900/50 divide-y divide-gray-800/30">
                  {candidatesData.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-medium text-white">{candidate.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base text-gray-300">{candidate.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={candidate.status} color={candidate.statusColor} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base font-medium text-white">{candidate.score}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                        <Link
                          to="/reportperformancepage"
                          className="text-white hover:text-purple-300 transition-colors flex items-center gap-1"
                        >
                          View Report
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {actionsData.map((action, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500">
                      {action.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{action.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{action.description}</p>
                </div>
                <Link to={action.link} className="mt-6 inline-block">
                  <button 
                    className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium transition-transform duration-300 group-hover:scale-105 shadow-lg"
                  >
                    {action.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}