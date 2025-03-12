"use client"

import React, { useState, useRef } from "react";
import { FaLinkedin, FaGithub, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Target } from "lucide-react";

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
    setCurrentIndex((prevIndex) => (prevIndex + 3) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? teamMembers.length - 3 : prevIndex - 3
    );
  };

  const displayedImages = teamMembers.slice(currentIndex, currentIndex + 3);

  // Animations and refs
  const aboutProjectRef = useRef(null);
  const teamSectionRef = useRef(null);
  const visionMissionRef = useRef(null);
  
  const isAboutInView = useInView(aboutProjectRef, { once: true, threshold: 0.2 });
  const isTeamInView = useInView(teamSectionRef, { once: true, threshold: 0.2 });
  const isVisionInView = useInView(visionMissionRef, { once: false, threshold: 0.2 });

  const fadeInAnimation = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="bg-[#0b0f1c]">
      {/* About Project Section */}
      <motion.div 
        ref={aboutProjectRef}
        className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16"
        variants={fadeInAnimation}
        initial="hidden"
        animate={isAboutInView ? "visible" : "hidden"}
      >
        <div className="text-center mt-4">
          <h1 className="text-5xl font-semibold text-white mb-8">
            What our Solution focuses on
          </h1>
          <button className="inline-flex items-center px-8 py-3 rounded-full bg-slate-200 transition-colors text-lg shadow-lg hover:bg-slate-300">
            <span className="mr-2">⚡</span>
            Get to know more about us
          </button>
        </div>
      </motion.div>
      {/* Vision and Mission Section - Enhanced with elements from second file */}
      <section 
        ref={visionMissionRef}
        className="relative overflow-hidden  "
      >       

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={isVisionInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isVisionInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
          
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={isVisionInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl mr-4 group-hover:bg-blue-500/20 transition-all duration-300">
                    <Lightbulb className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Vision</h3>
                </div>
                <p className="text-xl leading-relaxed text-slate-300">
                To be the leading AI-powered platform that empowers individuals worldwide to confidently pursue and
                successfully achieve their career aspirations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={isVisionInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl mr-4 group-hover:bg-purple-500/20 transition-all duration-300">
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Mission</h3>
                </div>
                <p className="text-xl leading-relaxed text-slate-300">
                To revolutionize interview preparation by providing accessible, personalized, and innovative AI-driven
                tools that enhance communication skills, build confidence, and unlock numerous career opportunities for all.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Team Section */}
      <motion.div 
        ref={teamSectionRef}
        className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16"
        variants={fadeInAnimation}
        initial="hidden"
        animate={isTeamInView ? "visible" : "hidden"}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-semibold text-white mb-12">Meet Our Team</h1>
          <p className="text-xl mb-10 leading-9 font-light text-slate-200 text-left">
            We are second-year undergraduate students at the Institute of
            Information Technology (IIT), University of Westminster, pursuing
            the CS-145 course. Our team is dedicated to bringing innovative
            solutions to the field of interview preparation through AI.
          </p>
          <p className="text-xl mb-10 leading-9 font-light text-slate-200 text-left">
            A big thank you to Mr. Banu Athuraliya and Mr. Suresh Peris for
            conducting and guiding us throughout this project. Their support
            has been invaluable in shaping our ideas into a tangible product.
          </p>
          <p className="text-xl mb-10 leading-9 font-light text-slate-200 text-left">
            Our AI Mock Interviewer platform, HIRED, is designed to help users
            prepare for real-world interviews through AI-powered simulations.
            The platform offers personalized feedback, body language analysis,
            and other innovative features aimed at enhancing communication skills
            and boosting confidence for job seekers.
          </p>
        </div>

        {/* Team Member Cards */}
        <div className="flex justify-center items-stretch space-x-8">
          <button
            onClick={prevSlide}
            className="bg-gray-600 text-white rounded-full p-3 hover:bg-gray-700 h-fit self-center transition-colors duration-300"
          >
            <FaChevronLeft size={22} />
          </button>

          {displayedImages.map((member, index) => (
            <div
              key={index}
              className="bg-[#1d2638] rounded-lg p-8 shadow-xl w-[420px] h-[550px] flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10 hover:border-blue-500/50"
            >
              <div className="w-full h-[320px] mb-6">
                <img
                  src={member.image}
                  alt={`Team member ${currentIndex + index}`}
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
      </motion.div>
    </div>
  );
}