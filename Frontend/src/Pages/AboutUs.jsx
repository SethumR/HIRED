"use client"

import React, { useState, useEffect } from "react";
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
  const [displayCount, setDisplayCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's mobile view when the component mounts and when the window resizes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDisplayCount(mobile ? 1 : 3);
    };

    // Initial check
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkMobile);
      }
    };
  }, []);

  const nextSlide = () => {
    if (isMobile) {
      // For mobile, go one by one
      setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    } else {
      // For desktop, go three by three
      setCurrentIndex((prevIndex) => (prevIndex + 3) % teamMembers.length);
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      // For mobile, go one by one
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
      );
    } else {
      // For desktop, go three by three
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? teamMembers.length - 3 : prevIndex - 3
      );
    }
  };

  // Get the currently displayed team members
  const displayedImages = teamMembers.slice(
    currentIndex, 
    Math.min(currentIndex + displayCount, teamMembers.length)
  );

  // If we're at the end and don't have enough members to fill the display count
  // Wrap around to the beginning
  if (displayedImages.length < displayCount) {
    const remaining = displayCount - displayedImages.length;
    displayedImages.push(...teamMembers.slice(0, remaining));
  }

  return (
    <div className="bg-[#0b0f1c]">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block mb-3 px-4 py-1.5 rounded-full bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Get to know us better</span>
            </div>
          </div>
          <h2 className="text-4xl font-semibold text-white mb-4 leading-tight">What our Solution focuses on</h2>
        </div>
      </div>
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 max-w-5xl mx-auto">
            <div className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50 flex flex-col items-center text-center">
                <div className="flex flex-col items-center mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl mb-4 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Lightbulb className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Vision</h3>
                </div>
                <p className="text-xl leading-relaxed text-slate-300">
                  To be the leading AI-powered platform that empowers individuals worldwide to confidently pursue and
                  successfully achieve their career aspirations.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 flex flex-col items-center text-center">
                <div className="flex flex-col items-center mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl mb-4 group-hover:bg-purple-500/20 transition-all duration-300">
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Mission</h3>
                </div>
                <p className="text-xl leading-relaxed text-slate-300">
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
          <h1 className="text-4xl font-semibold text-white mb-12">Meet Our Team</h1>
          <p className="text-xl mb-10 leading-9 font-light text-slate-200 text-left">
            We are second-year undergraduate students at the Institute of
            Information Technology (IIT), University of Westminster, pursuing
            the CS-145 course. Our team is dedicated to bringing innovative
            solutions to the field of interview preparation through AI.

            A big thank you to Mr. Banu Athuraliya and Mr. Suresh Peris for
            conducting and guiding us throughout this project. Their support
            has been invaluable in shaping our ideas into a tangible product.<br/>

            Our AI Mock Interviewer platform, HIRED, is designed to help users
            prepare for real-world interviews through AI-powered simulations.
            The platform offers personalized feedback, body language analysis,
            and other innovative features aimed at enhancing communication skills
            and boosting confidence for job seekers.
          </p>
        </div>

        {/* Team Member Cards with properly fixed mobile navigation */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch space-x-0 md:space-x-8 mb-24">
          <button
            onClick={prevSlide}
            className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 h-fit self-center transition-colors duration-300 mb-4 md:mb-0"
            aria-label="Previous team member"
          >
            <FaChevronLeft size={22} />
          </button>

          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
            {displayedImages.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="bg-[#1d2638] rounded-lg p-8 shadow-xl w-full md:w-[420px] h-auto md:h-[550px] flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10 hover:border-blue-500/50"
              >
                <div className="w-full h-[320px] mb-6">
                  <img
                    src={member.image}
                    alt={`${member.name}`}
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
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <FaLinkedin size={22} />
                    </a>
                    <a
                      href={member.github}
                      className="text-white transform hover:scale-110 transition duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub profile`}
                    >
                      <FaGithub size={22} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 h-fit self-center transition-colors duration-300 mt-4 md:mt-0"
            aria-label="Next team member"
          >
            <FaChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}