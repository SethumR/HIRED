"use client"

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Sidebar from "./SideBar"; // Import the Sidebar component
import { Code, MessageSquare, Zap, BarChart4, TrendingUp } from "lucide-react";

const colors = {
  background: "#0b0f1c",
  foreground: "#fdfdfd",
  card: "#0a2635",
  border: "#1a3545",
  purpleAccent: "#9333EA",
  purple: {
    600: "#8B5CF6"
  },
  pink: {
    500: "#EC4899"
  }
};

const userProfile = {
  name: "Sarah Wilson",
  title: "Software Engineer",
  initials: "SW",
};

const performanceMetrics = [
  { 
    title: "Technical", 
    value: "85%", 
    description: "Strong problem-solving skills",
    icon: <Code className="h-6 w-6 text-purple-400" />,
  },
  { 
    title: "Communication", 
    value: "92%", 
    description: "Excellent verbal skills",
    icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
  },
  { 
    title: "Confidence", 
    value: "78%", 
    description: "Good presence in interviews",
    icon: <Zap className="h-6 w-6 text-purple-400" />,
  },
];

const overallGrowth = [
  { date: "Jan", score: 65 },
  { date: "Feb", score: 68 },
  { date: "Mar", score: 75 },
  { date: "Apr", score: 82 },
  { date: "May", score: 87 },
  { date: "Jun", score: 92 },
];

const skillImprovement = [
  { skill: "Algorithms", improvement: 30 },
  { skill: "SD", improvement: 45 },
  { skill: "Database", improvement: 25 },
  { skill: "Networking", improvement: 35 },
  { skill: "Security", improvement: 20 },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen text-white font-sans bg-[#0b0f1c]">
      {/* Include the Sidebar component */}
      <Sidebar userProfile={userProfile} />
      <main className="flex-1 container mx-auto pt-[7.5rem] pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Performance Overview
            </h1>
            <p className="text-gray-400 mt-1">Tracking your progress and improvement</p>
          </div>
        </div>

        {/* Performance Metrics Cards - Styled like company dashboard */}
        <div className="grid gap-6 md:grid-cols-3">
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex flex-col justify-between transition duration-300 hover:translate-y-1 hover:shadow-xl border border-purple-500/20"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">{metric.title}</h3>
                  <div className="p-2 rounded-lg bg-purple-900/30">{metric.icon}</div>
                </div>
                <div className="text-3xl font-bold text-white">{metric.value}</div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-10">
          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 mb-6 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/30">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Overall Growth</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overallGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid rgba(147, 51, 234, 0.2)",
                      borderRadius: "0.5rem" 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#07ed7a" 
                    strokeWidth={2}
                    dot={{ fill: "#EC4899", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#EC4899" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/30">
                <BarChart4 className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Skill Improvement</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillImprovement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="skill" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid rgba(147, 51, 234, 0.2)",
                      borderRadius: "0.5rem" 
                    }} 
                  />
                  <Bar 
                    dataKey="improvement" 
                    fill="white"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;