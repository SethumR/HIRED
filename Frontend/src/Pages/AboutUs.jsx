"use client"

import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Lightbulb, Target, Sparkles } from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Sethum Ruberu",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "https://linkedin.com",
      github: "https://github.com/SethumR",
      image: "Sethum.png",
    },
    {
      name: "Sasindri Siriwardane",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "https://www.linkedin.com/in/sasindri-siriwardene-314320273/",
      github: "https://github.com/sasindri-siriwardene",
      image: "Sasindri.png",
    },
    {
      name: "Rehan Mandawala",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "https://www.linkedin.com/in/rehan-mandawala-504142266?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      github: "https://github.com/rehan20221237",
      image: "rehan.jpg",
    },
    {
      name: "Kavindu Gunathilake",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "http://www.linkedin.com/in/kavindu-gunathilaka-86297b297",
      github: "https://github.com/kethaka2005",
      image: "kethaka.jpg",
    },
    {
      name: "Nehan Karunarathna",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "https://www.linkedin.com/in/nehan-karunarathna-b80061301/",
      github: "https://github.com/nehan-karunarathna",
      image: "nehan.jpg",
    },
    {
      name: "Tilan Wishwajith",
      position: "Co-founder",
      description: "2nd year undergraduate student at University of Westminster",
      linkedin: "https://www.linkedin.com/in/tilan-wishwajith-381957320/",
      github: "https://github.com/Tilanwishwajith-ai",
      image: "/tilan.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };

  // Calculate which team members to display (keep original format but with single scrolling)
  const displayedMembers = [teamMembers[currentIndex]];
  
  // For desktop, show three members if possible
  if (teamMembers.length > 1) {
    const second = (currentIndex + 1) % teamMembers.length;
    const third = (currentIndex + 2) % teamMembers.length;
    displayedMembers.push(teamMembers[second]);
    displayedMembers.push(teamMembers[third]);
  }

  return (
    <div className="bg-[#0b0f1c]">
      {/* Top button styled like in upgrade page */}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Get to know us better</span>
            </div>
          </div>
          <h2 className="text-[42px] font-semibold text-white mb-4 leading-tight">What our Solution focuses on</h2>
        </div>
      </div>
{/* Vision and Mission Section */}
<section className="relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
      <div className="group">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl mr-4 group-hover:bg-blue-500/20 transition-all duration-300">
              <Lightbulb className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">Vision</h3>
          </div>
          <p className="text-xl leading-relaxed text-slate-300 text-center px-4">
            To be the leading AI-powered platform that empowers individuals worldwide to confidently pursue and
            successfully achieve their career aspirations.
          </p>
        </div>
      </div>

      <div className="group">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl mr-4 group-hover:bg-purple-500/20 transition-all duration-300">
              <Target className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">Mission</h3>
          </div>
          <p className="text-xl leading-relaxed text-slate-300 text-center px-4">
            To revolutionize interview preparation by providing accessible, personalized, and innovative AI-driven
            tools that enhance communication skills, build confidence, and unlock numerous career opportunities for all.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Our Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-[42px] font-semibold text-white mb-12">Meet Our Team</h1>
          <p className="text-xl mb-10 leading-9 font-light text-slate-200 text-left">
            We are second-year undergraduate students at the Institute of
            Information Technology (IIT), University of Westminster, pursuing
            the CS-145 course. Our team is dedicated to bringing innovative
            solutions to the field of interview preparation through AI.
            
            A big thank you to Mr. Banu Athuraliya and Mr. Suresh Peris for
            conducting and guiding us throughout this project. Their support
            has been invaluable in shaping our ideas into a tangible product.<br/>
            <br/>
            Our AI Mock Interviewer platform, HIRED, is designed to help users
            prepare for real-world interviews through AI-powered simulations.
            The platform offers personalized feedback, body language analysis,
            and other innovative features aimed at enhancing communication skills
            and boosting confidence for job seekers.
          </p>
        </div>

        {/* Team Member Cards with original styling */}
        <div className="flex justify-center items-stretch space-x-8 mb-24">
          <button
            onClick={prevSlide}
            className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 h-fit self-center transition-colors duration-300"
          >
            <FaChevronLeft size={22} />
          </button>

          {displayedMembers.map((member, index) => (
            <div
              key={index}
              className={`bg-[#1d2638] rounded-lg p-8 shadow-xl w-[420px] h-[550px] flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10 hover:border-blue-500/50 ${
                index === 0 ? "block" : "hidden md:block"
              }`}
            >
              <div className="w-full h-[320px] mb-6">
                <img
                  src={member.image}
                  alt={`Team member ${member.name}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-sm text-white/70 mb-2">{member.position}</p>
                <p className="text-white/90">{member.description}</p>
                <div className="flex justify-center space-x-6 mt-auto pt-4">
                  <a
                    href={member.linkedin}
                    className="text-white transform hover:scale-110 transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin size={22} />
                  </a>
                  <a
                    href={member.github}
                    className="text-white transform hover:scale-110 transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub size={22} />
                  </a>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={nextSlide}
            className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 h-fit self-center transition-colors duration-300"
          >
            <FaChevronRight size={22} />
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 -mt-16 mb-8">
          {teamMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-6 bg-blue-500" : "bg-gray-600"
              }`}
              aria-label={`Go to team member ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}