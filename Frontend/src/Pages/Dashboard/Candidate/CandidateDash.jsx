import React, { useEffect, useState } from 'react';
import { Bell, ChevronRight, Settings } from "lucide-react";
import { HiOutlineMicrophone } from "react-icons/hi"; 
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import { LuMessageCircle } from "react-icons/lu";
import { AiOutlineBulb } from 'react-icons/ai';
import { VscRobot } from "react-icons/vsc";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const performanceData = [
    { skill: "Technical", score: 85, icon: <FaChartBar className="w-6 h-6 text-purple-500" /> },
    { skill: "Communication", score: 92, icon: <LuMessageCircle className="w-6 h-6 text-purple-500" /> },
    { skill: "Confidence", score: 78, icon: <Star className="w-6 h-6 text-purple-500" /> },
  ];

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
            <h2 className="font-semibold text-white">{user ? user.name : "User Name"}</h2>
            <p className="text-sm text-gray-400">{user ? user.email : "User Email"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#0b0f1c] rounded-full text-gray-400">
            <Bell className="h-5 w-5" />
          </button>
          <button 
            className="p-2 hover:bg-[#0b0f1c] rounded-full text-gray-400" 
            onClick={() => navigate("/editprofile")}
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {/* Performance Overview */}
            <section>
              <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Performance Overview</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {performanceData.map(({ skill, score, icon }) => (
                  <div key={skill} className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg flex flex-col items-center">
                    {icon}
                    <div className="text-2xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">{score}%</div>
                    <div className="text-sm text-gray-400">{skill}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Preparation Progress */}
            <section className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Preparation Progress</h4>
                <span className="text-sm text-gray-400">75%</span>
              </div>
              <div className="bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </section>

            {/* AI Feedback */}
            <section className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                <VscRobot className="text-purple-500 w-5 h-5" /> Latest AI Feedback
              </h3>
              <div className="space-y-3">
                {[
                  "Structure your answers using the STAR method",
                  "Provide more specific examples in technical responses",
                  "Maintain consistent eye contact during video interviews",
                ].map((feedback, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border border-gray-800 bg-[#0b0f1c] p-4">
                    <div className="mt-1 h-4 w-4 rounded">
                      <AiOutlineBulb className="text-purple-500 h-5 w-5" />
                    </div>
                    <p className="text-gray-400">{feedback}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Past Interviews */}
            <section className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Past Interviews</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { company: "DataTech", date: "Feb 15", score: 88 },
                  { company: "CloudSys", date: "Feb 10", score: 92 },
                ].map((interview, index) => (
                  <div key={index} className="bg-[#0b0f1c] rounded-lg border border-gray-800 p-6 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{interview.company}</div>
                      <div className="text-sm text-gray-400">{interview.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-purple-500">{interview.score}% Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <section className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <h3 className="mb-4 text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Upcoming Interviews</h3>
              <div className="space-y-4">
                {[
                  { company: "TechCorp", role: "Senior Software Engineer", time: "Tomorrow, 2:00 PM", initials: "TC" },
                  { company: "InnovateLabs", role: "Full Stack Developer", time: "Feb 28, 11:00 AM", initials: "IL" },
                ].map((interview, index) => (
                  <div key={index} className="bg-[#0b0f1c] rounded-lg border border-gray-800">
                    <a href="#" className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {interview.initials}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{interview.company}</div>
                        <div className="text-sm text-gray-400">{interview.role}</div>
                        <div className="text-sm text-gray-400">{interview.time}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                ))}
              </div>
            </section>

                  <button
                    onClick={() => navigate("/interview")}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-4 font-semibold"
                  >
                    <HiOutlineMicrophone className="h-5 w-5" /> 
                    Start Mock Interview
                  </button>

                  <button
                    onClick={() => navigate("/uploadcv")}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-4 font-semibold"
                  >
                    <HiOutlineMicrophone className="h-5 w-5" /> 
                    Generate the Scripts
                  </button>

                  {/* Recommended */}
            <section className="bg-[#0d1221] p-6 rounded-lg border border-gray-800 shadow-cyan-500/20 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Recommended</h3>
                <a href="#" className="text-sm text-purple-500 hover:text-purple-400">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                {[
                  { title: "System Design Interview Guide", type: "Article", icon: "📄" },
                  { title: "Behavioral Questions Masterclass", type: "Video", icon: "🎥" },
                ].map((item, index) => (
                  <div key={index} className="bg-[#0b0f1c] rounded-lg border border-gray-800">
                    <a href="#" className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800">{item.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.type}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;