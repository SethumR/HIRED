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
  Area,
  AreaChart,
  Cell,
} from "recharts";
import Sidebar from "./SideBar";
import {
  Code,
  MessageSquare,
  Zap,
  BarChart4,
  TrendingUp,
  Sparkles,
  Target,
  Trophy,
  ArrowRight,
  Heart,
} from "lucide-react";

const colors = {
  background: "#0b0f1c",
  foreground: "#fdfdfd",
  card: "#0a2635",
  border: "#1a3545",
  purpleAccent: "#9333EA",
  purple: {
    600: "#8B5CF6",
  },
  pink: {
    500: "#EC4899",
  },
};

// Updated chart colors based on your request
const chartColors = [
  "#34200e", // Dark brown
  "#102826", // Dark teal
  "#0c202e", // Dark blue
  "#1f1533", // Dark purple
];

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

// Modified data for heartbeat graph
const overallGrowth = [
  { date: "Jan", score: 65 },
  { date: "Feb", score: 78 },
  { date: "Mar", score: 50 },
  { date: "Apr", score: 92 },
  { date: "May", score: 55 },
  { date: "Jun", score: 86 },
];

// Updated skill improvement data with new skills
const skillImprovement = [
  { skill: "Technical Knowledge", improvement: 75 },
  { skill: "Problem Solving", improvement: 85 },
  { skill: "Communication", improvement: 68 },
  { skill: "Critical Thinking", improvement: 72 },
];

// Custom tooltip component for the skill improvement chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-purple-500/20 rounded-lg p-3 ">
        <p className="text-purple-400 font-medium">{label}</p>
        <p className="">
          Improvement: <span className="text-purple-300">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

function TipsSection() {
  const tips = [
    {
      icon: Sparkles,
      tip: "Ensure your resume is up-to-date",
      description: "Include your most recent experiences and skills for the best results",
      color: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-400",
      hoverColor: "hover:from-blue-500/20 hover:to-blue-600/20",
      borderColor: "border-blue-500/20",
      glowColor: "group-hover:shadow-blue-500/10",
    },
    {
      icon: Target,
      tip: "Include relevant skills and experiences",
      description: "Focus on skills and experiences that are relevant to your target position",
      color: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-400",
      hoverColor: "hover:from-purple-500/20 hover:to-purple-600/20",
      borderColor: "border-purple-500/20",
      glowColor: "group-hover:shadow-purple-500/10",
    },
    {
      icon: Trophy,
      tip: "Highlight key achievements",
      description: "Quantify your achievements with numbers and metrics when possible",
      color: "from-emerald-500/10 to-emerald-600/10",
      iconColor: "text-emerald-400",
      hoverColor: "hover:from-emerald-500/20 hover:to-emerald-600/20",
      borderColor: "border-emerald-500/20",
      glowColor: "group-hover:shadow-emerald-500/10",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tips.map((item, index) => (
        <div key={item.tip} className="group relative">
          {/* Card */}
          <div
            className={`
              h-full p-6 rounded-xl transition-all duration-300
              bg-gray-900/40 backdrop-blur-sm
              border ${item.borderColor}
              hover:shadow-lg ${item.glowColor}
              hover:scale-[1.02]
            `}
          >
            {/* Icon */}
            <div className="mb-4">
              <div
                className={`
                w-12 h-12 rounded-xl
                bg-gray-900 border border-gray-800
                flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300
                shadow-lg
              `}
              >
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </div>

            {/* Content */}
            <h4 className="font-semibold text-gray-200 text-lg mb-2 group-hover:text-gray-100">{item.tip}</h4>
            <p className="text-gray-400 group-hover:text-gray-300">{item.description}</p>

            {/* Learn More Link */}
            <div
              className={`
              mt-4 flex items-center text-sm font-medium 
              ${item.iconColor} opacity-80 
              group-hover:opacity-100
            `}
            >
              <span className="mr-2">Learn more</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Highlight Effect */}
            <div
              className={`
              absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
              transition-opacity duration-500 pointer-events-none
              bg-gradient-to-br ${item.color} blur-xl -z-10
            `}
            />
          </div>

          {/* Number Badge */}
          <div
            className={`
            absolute -top-2 -right-2
            w-8 h-8 rounded-full
            bg-gray-900 border border-gray-800
            flex items-center justify-center
            text-sm font-semibold ${item.iconColor}
            group-hover:scale-110 transition-transform duration-300
            shadow-lg
          `}
          >
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}

const Dashboard = () => {
  return (
    <div className="flex min-h-screen text-white font-sans bg-[#0b0f1c]">
      {/* Include the Sidebar component */}
      <Sidebar userProfile={userProfile} />
      <main className="flex-1 container mx-auto pt-36 pb-12 px-4 sm:px-6 lg:px-8">
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
          {/* Overall Growth Chart */}
          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20 mb-6 lg:mb-0">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-purple-900/30">
                <Heart className="h-5 w-5 text-purple-400" /> {/* Updated color */}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Overall Growth</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overallGrowth}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors[1]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={chartColors[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0b0f1c",
                      border: "1px solid rgba(26, 76, 76, 0.2)",
                      borderRadius: "0.5rem",
                      color: "#fff",
                    }}
                    labelStyle={{ color: chartColors[1] }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={chartColors[1]}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={2}
                    dot={{ fill: chartColors[1], strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: chartColors[1] }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Skill Improvement Chart */}
          <section className="flex-1 bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/20">
  <div className="flex items-center gap-4 mb-4">
    <div className="p-2 rounded-lg bg-purple-900/30">
      <BarChart4 className="h-5 w-5 text-purple-400" />
    </div>
    <h2 className="text-lg font-bold text-white tracking-tight">Skill Improvement</h2>
  </div>
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={skillImprovement}
        barGap={20}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }} // Adjusted bottom margin
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="skill"
          stroke="#9ca3af"
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => {
            // Split long labels into two lines
            const words = value.split(" ");
            if (words.length > 1) {
              return words.join("\n");
            }
            return value;
          }}
          tickMargin={10}
        />
        <YAxis
          stroke="#9ca3af"
          domain={[0, 100]} // Set Y-axis domain to match Overall Growth Chart
        />
        <Tooltip content={<CustomTooltip />} />
        <defs>
          {chartColors.map((color, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`colorBar${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.8} />
            </linearGradient>
          ))}
        </defs>
        <Bar
          dataKey="improvement"
          radius={[5, 5, 0, 0]}
          barSize={70} // Increased bar size
          isAnimationActive={false}
          onMouseEnter={(e) => {
            e.target.style.fill = `url(#colorBar${e.payload.index})`;
          }}
        >
          {skillImprovement.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`url(#colorBar${index})`}
              stroke={chartColors[index]}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>
        </div>

        {/* Tips Section */}
        <div className="mt-10">
          <TipsSection />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;