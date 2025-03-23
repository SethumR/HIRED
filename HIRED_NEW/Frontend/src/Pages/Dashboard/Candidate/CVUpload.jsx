"use client"

import React, { useState } from "react";
import { ArrowRight, Upload, Bot, Edit, Check, Loader2, FileText, Download, RefreshCw, Sparkles, Target, Trophy } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import Sidebar from './SideBar';

export default function CVUpload() {
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success

  // Mock user profile data
  const userProfile = {
    initials: "JD",
    name: "John Doe",
    title: "Software Engineer",
  };

  // Handle File Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadStatus("uploading");
      setCvFile(file);
      setError("");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvText(e.target.result);
        setUploadStatus("success");
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setUploadStatus("idle");
      };
      reader.readAsText(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCvFile(file);
      setError("");
      setUploadStatus("uploading");
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCvText(e.target.result);
        setUploadStatus("success");
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
        setUploadStatus("idle");
      };
      reader.readAsText(file);
    }
  };

  // Handle Script Generation
  const generateScript = async () => {
    if (!cvFile) {
      setError("Please upload a resume.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", cvFile);

      const response = await fetch("http://localhost:8000/generate_script/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log the error response for debugging
        if (response.status === 503) {
          setError("The service is currently unavailable. Please try again later.");
        } else {
          setError(errorData.detail || "Failed to generate script. Please try again.");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data); // Log the response data for debugging

      // Ensure the script object has the expected structure
      if (data.script && typeof data.script === "object") {
        setScript(data.script);
      } else {
        setError("Invalid script format received from the server.");
      }
    } catch (err) {
      console.error("Error generating script:", err); // Log the error for debugging
      setError("Failed to generate script. Please try again.");
    }

    setLoading(false);
  };

  // Handle PDF Download
  const handleDownload = async () => {
    if (!script) {
      console.error("No script available for download.");
      return;
    }

    try {
      setDownloading(true);

      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font styles
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      
      // Add title
      doc.text("AI-Generated Introduction Script", 20, 20);
      
      // Add generation date
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Add horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // Function to add a section with title and content
      const addSection = (title, content, yPosition) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(title, 20, yPosition);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        
        // Split text into lines that fit the page width
        const lines = doc.splitTextToSize(content, 170);
        doc.text(lines, 20, yPosition + 10);
        
        return yPosition + 10 + (lines.length * 7); // Return the new Y position
      };
      
      // Add each section
      let yPos = 45;
      yPos = addSection("Personalized Introduction", script.personalized_intro || "No personalized introduction generated.", yPos);
      yPos = addSection("Overall Feedback", script.overall_feedback || "No overall feedback generated.", yPos + 15);
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(128);
      doc.text("Generated by AI Introduction Generator", 20, 280);
      
      // Save the PDF
      doc.save("ai-introduction-script.pdf");
      
      setDownloading(false);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setError("Failed to generate PDF. Please try again.");
      setDownloading(false);
    }
  };

  // Handle PDF View
  const handleViewPDF = () => {
    if (!script) {
      console.error("No script available for viewing.");
      return;
    }

    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font styles
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    
    // Add title
    doc.text("AI-Generated Introduction Script", 20, 20);
    
    // Add generation date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Function to add a section with title and content
    const addSection = (title, content, yPosition) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, 20, yPosition);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, yPosition + 10);
      
      return yPosition + 10 + (lines.length * 7); // Return the new Y position
    };
    
    // Add each section
    let yPos = 45;
    yPos = addSection("Personalized Introduction", script.personalized_intro || "No personalized introduction generated.", yPos);
    yPos = addSection("Overall Feedback", script.overall_feedback || "No overall feedback generated.", yPos + 15);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text("Generated by AI Introduction Generator", 20, 280);
    
    // Open the PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b0f1c] flex">
      <Sidebar userProfile={userProfile}/>
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-3xl font-bold mb-5 mt-20 bg-clip-text text-white">
              AI-Powered Introduction Generator
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto -mb-5">
              Transform your resume into a compelling self-introduction in seconds
            </p>
          </div>

          {/* Process Steps */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
            {[
              { icon: Upload, text: "Upload Resume", description: "Upload your CV or resume" },
              { icon: Bot, text: "AI Processing", description: "Our AI analyzes your experience" },
              { icon: Edit, text: "Edit Script", description: "Customize your introduction" },
            ].map((step, index) => (
              <div key={step.text} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-950/50 border border-blue-800/50 flex items-center justify-center shadow-lg shadow-blue-500/10">
                    <step.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="ml-3 font-medium text-gray-300">{step.text}</span>
                  {index < 2 && <ArrowRight className="w-5 h-5 text-gray-600 mx-4 hidden md:block" />}
                </div>
                <p className="text-sm text-gray-500 mt-2">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Upload and Preview Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div
              className={`p-8 border rounded-xl transition-all duration-300 backdrop-blur-sm ${
                uploadStatus === "success"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-gray-700 hover:border-blue-500/50 bg-gray-900/30"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {uploadStatus === "success" ? (
                  <div className="animate-fade-in">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-green-400">Resume Uploaded Successfully!</h3>
                    <p className="text-gray-400 mb-4">
                      {cvFile?.name} ({(cvFile?.size / 1024).toFixed(1)} KB)
                    </p>
                    <button
                      onClick={() => {
                        setCvFile(null)
                        setCvText("")
                        setUploadStatus("idle")
                      }}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Upload Different File
                    </button>
                  </div>
                ) : uploadStatus === "uploading" ? (
                  <div>
                    <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Processing Your Resume...</h3>
                    <p className="text-gray-400 mb-4">This will only take a moment</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Upload Your Resume</h3>
                    <p className="text-gray-400 mb-6">Drag & drop your resume file here, or click to browse</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      id="resume-upload"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer px-6 py-3 bg-blue-500 text-white rounded-lg inline-block shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors"
                    >
                      Browse Files
                    </label>
                    <p className="text-sm text-gray-500 mt-6">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Preview Area */}
            <div className="p-8 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 shadow-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-300">
                <span className="bg-blue-950/50 border border-blue-800/50 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                </span>
                Your AI-Generated Script
              </h3>

              <div className="p-6 bg-gray-800/30 border border-gray-700/30 rounded-lg mb-4">
                <div className="py-8 text-center text-gray-500">
                  {/* Placeholder Message */}
                  <p className="mb-2">Your professional introduction will appear here after processing your resume.</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-lg text-red-400 text-sm mt-4 text-center">
                    {error}
                  </div>
                )}

                {/* Loading Message */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 mt-4">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-400 mb-4" />
                    <p className="text-gray-400">Generating your professional introduction...</p>
                  </div>
                ) : script ? (
                  // Script Content
                  <div className="space-y-6 animate-fade-in mt-4">
                    <div className="p-4 bg-blue-950/30 border border-blue-800/30 rounded-lg">
                      <h4 className="font-semibold text-gray-300 mb-2 flex items-center">
                        <span className="bg-blue-950/50 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          <span className="text-blue-400 text-xs">1</span>
                        </span>
                        Personalized Script
                      </h4>
                      <p className="text-gray-400">{script.personalized_intro}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex justify-between items-center mt-8 mb-5">
                <span className="text-gray-500 text-sm">
                  {script ? `${script.personalized_intro.split(" ").length} words` : "0 words"}
                </span>
                <div className="space-x-3">
                  {script && (
                    <>
                      <button
                        className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2 text-gray-300"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2 text-gray-300"
                        onClick={handleViewPDF}
                      >
                        <FileText className="w-4 h-4" />
                        View PDF
                      </button>
                    </>
                  )}
                  <button
                    className={`px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors inline-flex items-center gap-2 ${
                      !cvText && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={generateScript}
                    disabled={!cvText || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Generate Script
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mb-24 mt-40">
            <TipsSection />
          </div>
        </div>
      </main>

      {/* Download notification */}
      {downloading && (
        <div className="fixed bottom-4 right-4 bg-gray-900/90 shadow-xl rounded-lg p-4 flex items-center gap-3 border border-gray-800 animate-fade-in backdrop-blur-sm">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-300">Preparing your PDF...</span>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

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
    <div className="mt-12 p-8 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/30 to-purple-950/30 opacity-50" />
      <div className="absolute inset-0 bg-[linear-gradient(30deg,_transparent_40%,_rgba(30,_41,_59,_0.5)_70%)]" />

      {/* Content */}
      <div className="relative">
        <h3 className="font-semibold text-2xl mb-8 flex items-center text-gray-100">
          <span className="bg-blue-950/50 border border-blue-800/50 w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-inner">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </span>
          Tips for Better Results
        </h3>

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
      </div>
    </div>
  );
}