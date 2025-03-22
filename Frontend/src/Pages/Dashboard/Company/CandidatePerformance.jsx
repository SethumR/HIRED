import { useState } from "react";
import { FiArrowLeft, FiDownload, FiPlay, FiPause } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart4, TrendingUp } from "lucide-react";

// Mock data for demonstration
const candidates = [
  {
    id: 1,
    name: "John Doe",
    role: "Software Engineer",
    date: "2023-06-15",
    overallScore: 85,
    technicalScore: 90,
    communicationScore: 80,
    confidenceScore: 85,
    problemSolvingScore: 85,
    questions: [
      {
        question: "Explain the concept of recursion and provide an example.",
        answer:
          "Recursion is a programming concept where a function calls itself to solve a problem by breaking it down into smaller, more manageable pieces. A common example is calculating factorial...",
        feedback:
          "Good explanation of recursion with a relevant example. Consider discussing base cases and potential pitfalls.",
        score: 85,
      },
      {
        question: "What are the key differences between REST and GraphQL?",
        answer:
          "REST and GraphQL are both API architectural styles. REST uses multiple endpoints for different resources, while GraphQL uses a single endpoint. GraphQL allows clients to request specific data...",
        feedback:
          "Excellent comparison of REST and GraphQL. You could improve by mentioning performance considerations and use cases for each.",
        score: 90,
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Software Engineer",
    date: "2023-06-16",
    overallScore: 88,
    technicalScore: 92,
    communicationScore: 85,
    confidenceScore: 88,
    problemSolvingScore: 87,
    questions: [
      {
        question: "Explain the concept of recursion and provide an example.",
        answer:
          "Recursion is a technique where a function calls itself to solve a problem. It's often used for tasks that can be broken down into similar subtasks. An example is the Fibonacci sequence...",
        feedback:
          "Very clear explanation with a good example. You could improve by discussing the importance of base cases in recursive functions.",
        score: 88,
      },
      {
        question: "What are the key differences between REST and GraphQL?",
        answer:
          "REST and GraphQL are two approaches to building APIs. REST uses multiple endpoints, each returning fixed data structures. GraphQL, on the other hand, uses a single endpoint and allows clients to request exactly the data they need...",
        feedback:
          "Excellent comparison. You demonstrated a good understanding of both technologies. Consider mentioning real-world scenarios where one might be preferred over the other.",
        score: 92,
      },
    ],
  },
];

const performanceData = [
  { name: "Technical", John: 90, Jane: 92 },
  { name: "Communication", John: 80, Jane: 85 },
  { name: "Confidence", John: 85, Jane: 88 },
  { name: "Problem Solving", John: 85, Jane: 87 },
];

export default function CandidatePerformancePage() {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const handleCandidateChange = (candidateId) => {
    const candidate = candidates.find((c) => c.id === parseInt(candidateId));
    if (candidate) {
      setSelectedCandidate(candidate);
    }
  };

  const handleAudioPlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
  };

  // Data for the bar graph
  const barData = [
    { name: "Technical", score: selectedCandidate.technicalScore, fill: "#34200e" },
    { name: "Communication", score: selectedCandidate.communicationScore, fill: "#102826" },
    { name: "Confidence", score: selectedCandidate.confidenceScore, fill: "#0c202e" },
    { name: "Problem Solving", score: selectedCandidate.problemSolvingScore, fill: "#1f1533" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f1c]">
      <main className="flex-1 container pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Page Title and Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Candidate Performance & Reports</h1>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border border-gray-800 rounded-lg bg-[#161a26] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleCandidateChange(e.target.value)}
            >
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id.toString()}>
                  {candidate.name}
                </option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-violet-900/30 border border-violet-500/30 text-white rounded-lg hover:from-pink-500 hover:to-purple-500">
              <FiDownload className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-[#161a26] text-gray-300 rounded-lg hover:bg-gray-800 border border-gray-800"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Bar Graph and Line Graph Section */}
        <div className="flex flex-col lg:flex-row gap-6 mt-10">
          {/* Bar Graph - Candidate Performance */}
          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 mb-6 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/30">
                <BarChart4 className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Candidate Performance</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />

                  <Bar
                    dataKey="score"
                    fill="#07ed7a"
                    barSize={80}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Line Graph - Performance Comparison */}
          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/30">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Performance Comparison</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid rgba(147, 51, 234, 0.2)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="John"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ fill: "#a855f7", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#a855f7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Jane"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#ec4899" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow p-6 mt-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4 text-white">Detailed Question Review</h2>
          <div className="space-y-4">
            {selectedCandidate.questions.map((q, index) => (
              <div key={index} className="border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Question {index + 1}</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#0b0f1c] p-4 rounded-lg">
                    <h3 className="font-semibold text-white">Question:</h3>
                    <p className="text-gray-300">{q.question}</p>
                  </div>
                  <div className="bg-[#0b0f1c] p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-white">Candidate's Answer:</h3>
                    <div className="flex items-center space-x-4 mb-2">
                      <button
                        className="flex items-center space-x-2 px-3 py-2 bg-violet-900/30 border border-violet-500/30 text-white rounded-lg hover:from-pink-500 hover:to-purple-500"
                        onClick={handleAudioPlayback}
                      >
                        {isPlaying ? <FiPause className="h-4 w-4" /> : <FiPlay className="h-4 w-4" />}
                        <span>Playback</span>
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioProgress}
                        className="w-full"
                        disabled
                      />
                    </div>
                    <p className="text-gray-300">{q.answer}</p>
                  </div>
                  <div className="bg-[#0b0f1c] p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-white">AI Feedback:</h3>
                    <p className="text-gray-300">{q.feedback}</p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-300">Score:</span>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div
                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${q.score}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300">{q.score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlisting Panel */}
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow p-6 mt-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-4 text-white">Shortlisting Panel</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-300">Candidate</th>
                  <th className="text-left py-3 px-4 text-gray-300">Overall Score</th>
                  <th className="text-left py-3 px-4 text-gray-300">Technical</th>
                  <th className="text-left py-3 px-4 text-gray-300">Communication</th>
                  <th className="text-left py-3 px-4 text-gray-300">Confidence</th>
                  <th className="text-left py-3 px-4 text-gray-300">Problem Solving</th>
                  <th className="text-left py-3 px-4 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-white">{candidate.name}</td>
                    <td className="py-3 px-4 text-white">{candidate.overallScore}%</td>
                    <td className="py-3 px-4 text-white">{candidate.technicalScore}%</td>
                    <td className="py-3 px-4 text-white">{candidate.communicationScore}%</td>
                    <td className="py-3 px-4 text-white">{candidate.confidenceScore}%</td>
                    <td className="py-3 px-4 text-white">{candidate.problemSolvingScore}%</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                          Shortlist
                        </button>
                        <button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                          Reject
                        </button>
                        <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                          Follow-Up
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}