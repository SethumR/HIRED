import React from "react";
import { Link } from "react-router-dom";
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

const colors = {
  background: "#0b0f1c",
  foreground: "#fdfdfd",
  card: "#0a2635",
  border: "#1a3545",
  purplePinkFrom: "#8B5CF6",
  purplePinkTo: "#EC4899",
  accentPurple: "#9333EA",
  accentPink: "#EC4899",
};

const userProfile = {
  name: "Sarah Wilson",
  title: "Software Engineer",
  initials: "SW",
};

const performanceMetrics = [
  { title: "Technical", value: "85%" },
  { title: "Communication", value: "92%" },
  { title: "Confidence", value: "78%" },
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
    <div className="flex h-screen text-white font-sans bg-[#0b0f1c] py-24 ">
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
        <nav className="flex-1 mb-6">
          {["Dashboard", "Start Mock Interview", "Interview History", "Generate Script", "Settings"].map((item, index) => (
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
                index === 0 ? "bg-[#1e293b]  text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 mt-6">Performance Overview</h1>
        <div className="grid grid-cols-3 gap-4 mb-12">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-[#0a2635] rounded-lg p-6 shadow-md flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-300">{metric.title}</h3>
              <p className="text-2xl font-bold mt-2 text-white">{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-6">
          <section className="flex-1 bg-[#0a2635] rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Overall Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overallGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="date" stroke={colors.foreground} />
                  <YAxis stroke={colors.foreground} />
                  <Tooltip contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} />
                  <Line type="monotone" dataKey="score" stroke={colors.accentPurple} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="flex-1 bg-[#0a2635] rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Skill Improvement</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillImprovement}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis dataKey="skill" stroke={colors.foreground} />
                  <YAxis stroke={colors.foreground} />
                  <Tooltip contentStyle={{ backgroundColor: colors.card, border: `1px solid ${colors.border}` }} />
                  <Bar dataKey="improvement" fill="white" />
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
