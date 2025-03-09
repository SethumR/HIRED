import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  FaBrain,
  FaPhoneAlt,
  FaFileAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaVolumeUp,
} from "react-icons/fa";
import ContactPage from "./ContactPage";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { UserPlus, Calendar, MessageSquare, Award } from "lucide-react"

// Animated Stat Component
function AnimatedStat({ endValue, label, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const increment = endValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, endValue]);

  return (
    <div ref={ref} className="text-center p-4" data-aos="fade">
      <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
        {new Intl.NumberFormat().format(count)}
        {suffix}
      </div>
      <div className="text-white text-sm md:text-sm lg:text-base font-medium">
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("candidates"); // Manage active tab

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      easing: "ease-in-out",
      once: true, // Trigger animation only once
    });
  }, []);

  const candidateFeatures = [
    {
      icon: FaBrain,
      title: "Smart Interview Simulation",
      description:
        "Our advanced AI bot is trained to conduct realistic audio based  mock interviews, simulating various scenarios and industries to provide personalised experience.",
    },
    {
      icon: FaPhoneAlt,
      title: "Audio Mock Interview Simulations",
      description:
        "Conduct AI-driven audio interviews simulating real scenarios. Get personalized feedback and performance analysis in real-time.",
    },
    {
      icon: FaFileAlt,
      title: " Get Personalized Scripts",
      description:
        "Upload your CV to generate a personalized script that helps you confidently introduce yourself in interviews.",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Practice Anytime, Anywhere",
      description:
        "Access our platform anytime, on any device, allowing you to improve your skills at your own pace and convenience.",
    },
    {
      icon: FaBuilding,
      title: "Automated Feedback with Scoring",
      description:
        "Get instant AI feedback with scoring to track progress, identify strengths, and improve performance.",
    },
    {
      icon: FaVolumeUp,
      title: "Resource for Continuous Learning",
      description:
        " Get access to additional  resources linked to feedback to refine skills, bridge knowledge gaps, and enhance learning.",
    },
  ];

  const companyFeatures = [
    {
      icon: FaBrain,
      title: "Smart Interview Simulation",
      description:
        "Our AI-driven platform conducts structured, role-specific interviews, adapting to various industries to streamline candidate evaluations.",
    },
    {
      icon: FaFileAlt,
      title: "Pre-record Interview Questions",
      description:
        "Offer pre-recorded interview questions with model answers to facilitate standardized evaluations for recruiters.",
    },
    {
      icon: FaPhoneAlt,
      title: "Seamless Candidate Assessment ",
      description:
        "Automatically generate and send interview links, allowing candidates to complete AI-driven assessments at their convenience.",
    },

    {
      icon: FaMapMarkerAlt,
      title: "Score-Based Candidate Filtering",
      description:
        "Efficiently assess and filter candidates based on predefined criteria, such as skills, experience, and interview performance, to ensure a better match for the role.",
    },
    {
      icon: FaVolumeUp,
      title: "Performance Reports and  Metrics",
      description:
        "Generate detailed performance reports analyzing communication, technical proficiency, and role suitability, highlighting strengths and areas for improvement.",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Effortless Hiring Workflow",
      description:
        "Automate interview scheduling, evaluation, and feedback—reducing hiring time and improving decision-making accuracy.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is HIRED ?",
      answer:
        "Hired solutions is an advanced artificial intelligence system designed to help you practice and prepare for job interviews through realistic simulations.",
    },
    {
      question: "Can I practice interviews for any job in any industry?",
      answer:
        "Yes, our AI system is trained to conduct interviews across various industries and job roles, adapting to your specific needs and requirements.",
    },
    {
      question:
        "Can I practice for any interview round with Hired?",
      answer:
        "Yes, you can practice for different types of interview rounds including technical, behavioral, and leadership interviews.",
    },
    {
      question: "How many mock interviews can I take?",
      answer:
        "The number of mock interviews depends on your subscription plan. Please check our pricing page for detailed information.",
    },
    {
      question: "What kind of feedback do I receive after an interview?",
      answer:
        "You receive comprehensive feedback on your performance, including analysis of your responses, communication skills, and areas for improvement.",
    },
    {
      question: "How does Hired ensure the relevance of interview questions?",
      answer:
        "Our AI system continuously updates its question bank based on current industry trends and real interview experiences.",
    },
    {
      question: "How can I contact Coustomer Support?",
      answer:
        "If you have any questions or need assistance, you can contact our customer support team through the contact form on our website or by emailing hired.infous@gmail.com We are here to help!",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const StepCard = ({ step, imageSrc, title, description }) => (
    <div className="relative">
      <div className="absolute -top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500  text-white flex items-center justify-center text-xl font-semibold">
        {step}
      </div>
      <div className="bg-[#dbdede] rounded-xl p-6 h-full">
        <img
          src={imageSrc}
          alt={`${title} interface`}
          className="w-full rounded-lg mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  const features =
    activeTab === "candidates" ? candidateFeatures : companyFeatures;
    

  return (
    <div className="min-h-screen bg-[#0b0f1c] text-white">
      {/* Hero Section */}
      <section id="home">
      <div className="container mx-auto px-6 pt-48 lg:pt-56 lg:pb-48 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-[55px] font-bold leading-tight text-white tracking-wide ">
              Are You Looking{" "}
              <span className="block">
                <TypeAnimation
                  sequence={[
                    "To Get Hired?",
                    1000,
                    "To Land Your Job?",
                    1000,
                    // 'To Ace Your Interviews?',
                    // 1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                />
              </span>
            </h1>
            <div className="space-y-6 text-gray-400 leading-relaxed tracking-wide">
              <p className="text-[16px] sm:text-lg">
                Prepare for interviews with AI-powered mock sessions to gain
                confidence, overcome anxiety, and excel in any role or industry.
                Get detailed feedback and suggestions to improve your responses,
                ensuring you're ready to land your dream job.
              </p>
            </div>
            <div data-aos="fade">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-white px-5 py-3 text-lg font-semibold rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                Try a Free Mock Interview
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block relative">
            <img
              // src="HIRED.png"
              alt="AI Interview Assistant"
              className="w-full max-w-[500px] mx-auto transform transition duration-700 hover:scale-105"
              data-aos="zoom-in"
            />
            <div className="absolute -z-10 inset-0 bg-purple-500 blur-[100px] opacity-30"></div>
          </div>

          <div data-aos="fade">
            <div className="max-w-xs sm:max-w-lg overflow-hidden mx-auto ml-1 -mt-2 bg-[#0d1221] shadow-lg shadow-cyan-500/20 h-20 sm:h-24 rounded-xl sm:mb-1 mb-28">
              <motion.div
                className="flex space-x-8 justify-center"
                animate={{ x: ["0%", "-100%"] }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <img
                  src="Google.png"
                  alt="Google"
                  className="w-28 h-24 object-contain"
                />{" "}
                {/* Reduced image size */}
                <img
                  src="Meta.png"
                  alt="Meta"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Amazon.png"
                  alt="Amazon"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Netflix.png"
                  alt="Netfix"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Mic.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Airbnb.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Op.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
                {/* Duplicate the images to make the animation seamless */}
                <img
                  src="Google.png"
                  alt="Google"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Meta.png"
                  alt="Meta"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Amazon.png"
                  alt="Amazon"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Netflix.png"
                  alt="Netfix"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Mic.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Airbnb.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
                <img
                  src="Op.png"
                  alt="Microsoft"
                  className="w-28 h-24 object-contain"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features">       
      <div
        className="flex flex-row justify-center -space-x-1 sm:space-x-4 mb-16 text-center"
        data-aos="fade"
      >
        <button
          onClick={() => setActiveTab("candidates")}
          className={`text-[27px] sm:text-3xl md:text-[33px] font-bold py-2 px-4 rounded-lg transition duration-200 ${
            activeTab === "candidates"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Candidates
        </button>
        <button
          onClick={() => setActiveTab("companies")}
          className={`text-[27px] sm:text-3xl md:text-[33px] font-bold py-2 px-4 rounded-lg transition duration-200 ${
            activeTab === "companies"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Companies
        </button>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 lg:mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 md:p-8 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors duration-300 flex flex-col h-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
              data-aos="fade"
            >
              <div className="flex flex-col items-center text-center h-full">
                <motion.div
                  className="w-12 h-12 mb-3 text-white flex items-center justify-center"
                  animate={{
                    x: [0, 10, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    },
                  }}
                >
                  <feature.icon className="w-7 h-7" />
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                  {feature.title}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>     

      {/* Animated Stats Section
      <div className="container mx-auto px-4 py-16 mb-28">
        <div className="shadow-lg rounded-lg p-10 bg-[#0d1221] shadow-cyan-500/10 border border-gray-900">
          <div className="flex flex-col space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <AnimatedStat
                endValue={150000}
                label="Interviews Conducted in 2023"
              />
              <AnimatedStat
                endValue={120000}
                label="Candidates Passed Interviews"
              />
              <AnimatedStat endValue={30000} label="Candidates Rejected" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <AnimatedStat endValue={85} label="Success Rate" suffix="%" />
              <AnimatedStat
                endValue={50}
                label="Average Interviews Taken per Candidate"
              />
            </div>
          </div>
        </div>
      </div> */}

      <div data-aos="fade" className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl sm:text-3xl md:text-[40px] font-semibold mb-6 sm:mb-8 md:mb-12">
          Try an Interactive Demo
        </h1>
        <div className="w-full max-w-5xl mx-auto border border-gray-700 p-4 sm:p-6 md:p-12 lg:p-20 rounded-lg mb-12 sm:mb-20 md:mb-40 h-auto sm:h-96 md:h-[500px] lg:h-[560px] shadow-slate-700 shadow-sm">
          <img
            src=""
            alt="Demo Screenshot"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>


      {/* Interview */}
      <div className="min-h-screen  text-white p-8 ">
        <div data-aos="fade">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-semibold text-center mb-20 sm:mb-28">
            Ace Your Interviews with Confidence
          </h1>
        </div>

        <div data-aos="fade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-28 sm:mb-40">
            {/* Description Section */}
            <div className="space-y-10">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {" "}
                AI-Powered Mock Interviews for Any Job Role
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg md:text-[17px]">
                Prepare for any job role in any industry with real-time, audio-based mock interviews that simulate an actual online
                interview experience. Simply enter your job title and description, select your interview type (Behavioral, Technical,
                Leadership, or HR), and let AI generate tailored interview questions to match your role. Gain confidence by practicing
                authentic, role-specific interviews anytime, anywhere.
              </p>
            </div>

            {/* Interview List Image */}
            <div className="relative">
              <img
                src="https://www.mockinterviewer.ai/_next/image?url=%2Ffeature-screens%2Ffeature-custom-interviews.png&w=828&q=75"
                alt="Interview list showing different job positions and their schedules"
                className="rounded-xl w-full h-60 sm:h-80 lg:h-88 object-cover shadow-[0_0_15px_rgba(128,0,128,0.8)]"
              />
            </div>
          </div>
        </div>

        <div data-aos="fade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-28 sm:mb-40">
            {/* Interview List Image */}
            <div className="relative">
            <img
              src="https://www.mockinterviewer.ai/_next/image?url=%2Ffeature-screens%2Ffeature-overall-feedback.png&w=828&q=75"
              alt="Interview list showing different job positions and their schedules"
              className="rounded-xl w-full h-64 sm:h-80 lg:h-[400px] object-cover border border-opacity-60 border-white shadow-[0_0_13px_rgba(255,255,255,0.5)]"
            />
          </div>


            {/* Description Section */}
            <div className="space-y-10">
              <h2 className="text-xl sm:text-2xl font-semibold">
              Overall Performance Report with Score
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg md:text-[17px]">
              Transform your interview performance with unparalleled insights. Our GPT-4 based AI goes beyond simple evaluations. 
              Receive a holistic performance score, detailed feedback on your strengths and areas for growth,
              and specific insights on each answer you provide. Elevate your interview skills with personalized 
              suggestions for crafting impactful responses. Prepare smarter, interview better.
              </p>
            </div>
          </div>
        </div>

        <div data-aos="fade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-28 sm:mb-40">
            {/* Description Section */}
            <div className="space-y-10">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {" "}
                AI-Generated Feedback & Learning Resources
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg md:text-[17px]">
                After each interview, receive detailed AI-powered feedback on
                your responses, including insights into communication, technical
                accuracy, and confidence levels. Get personalized improvement
                suggestions for each question and access additional learning
                resources to refine your skills and bridge knowledge
                gaps—ensuring you're fully prepared for your next big
                opportunity.
              </p>
            </div>

            {/* Interview List Image */}
            <div className="relative">
              <img
                src="https://www.mockinterviewer.ai/_next/image?url=%2Ffeature-screens%2Ffeature-answer-feedback.png&w=828&q=75"
                alt="Interview list showing different job positions and their schedules"
                className="rounded-xl w-full h-64 sm:h-80 lg:h-96 object-cover shadow-[0_0_15px_rgba(128,0,128,0.8)]"
              />
            </div>
          </div>
        </div>

        {/* Interview */}
          <div data-aos="fade">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-semibold text-center mb-12 sm:mb-28">
              Smarter, Faster, AI-Driven Hiring
            </h1>
          </div>
        

        <div data-aos="fade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-2 sm:mb-20 mt-2">
            {/* Description Section */}
            <div className="space-y-10">
              <h2 className="text-xl sm:text-[26px] font-semibold">
               Master Your Hiring Process with AI
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg md:text-[17px]">
                Automate role-specific, audio-based interviews for any job
                position across industries. Simply input the job title and
                description, select the interview type (Behavioral, Technical,
                Leadership, or HR), and let AI generate tailored interview
                questions. Allow candidates to complete interviews at their
                convenience while ensuring a consistent and structured
                evaluation process.
              </p>
            </div>

            {/* Interview List Image */}
            <div className="relative">
              <img
                src="https://www.mockinterviewer.ai/_next/image?url=%2Ffeature-screens%2Ffeature-answer-audio.png&w=828&q=75"
                alt="Interview list showing different job positions and their schedules"
                className="rounded-xl w-full h-64 sm:h-80 lg:h-96 object-cover shadow-[0_0_15px_rgba(128,0,128,0.8)] mb-20"
              />
            </div>
          </div>
        </div>

        <div data-aos="fade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-28 sm:mb-40">
            {/* Interview List Image */}
            <div className="relative">
            <img
              src="https://www.mockinterviewer.ai/_next/image?url=%2Ffeature-screens%2Ffeature-skills-feedback.png&w=828&q=75"
              alt="Interview list showing different job positions and their schedules"
              className="rounded-xl w-full h-64 sm:h-80 lg:h-88 object-cover border border-opacity-60 border-white shadow-[0_0_13px_rgba(255,255,255,0.5)]"
            />
          </div>

            {/* Description Section */}
            <div className="space-y-10">
              <h2 className="text-xl sm:text-2xl font-semibold">
                AI-Powered Candidate Insights & Smart Shortlisting
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg md:text-[17px]">
                Receive detailed AI-generated performance reports with insights
                into technical skills, communication, and overall suitability.
                Get automated scoring for each question, identify top candidates
                efficiently, and access AI-suggested follow-up questions or
                learning resources to refine your hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div data-aos="fade">
        <h1 className="text-center text-2xl sm:text-4xl md:text-4xl font-semibold mb-8 sm:mb-10 md:mb-12">
          Unleash Your Career Potential
        </h1>
        <p className="space-y-6 text-gray-400 leading-relaxed tracking-wide text-base sm:text-lg md:text-xl text-center mb-6 sm:mb-8 md:mb-10 max-w-3xl sm:max-w-4xl md:max-w-5xl mx-auto">
          Land your dream job at your dream company by showcasing your skills,
          passion, and determination. Prepare, stand out, and take the first
          step toward the career you’ve always wanted.
        </p>

        <div className="max-w-sm sm:max-w-5xl overflow-hidden mx-auto bg-[#0d1221] shadow-lg shadow-cyan-500/10 h-24 sm:h-[120px] rounded-xl mb-32">
          {" "}
          {/* Reduced height */}
          <motion.div
            className="flex space-x-12"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <img
              src="Google.png"
              alt="Image 1"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Meta.png"
              alt="Image 2"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Amazon.png"
              alt="Image 3"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Netflix.png"
              alt="Image 4"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Mic.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Airbnb.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Op.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />

            {/* Duplicate the images to make the animation seamless */}
            <img
              src="Google.png"
              alt="Image 1"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Meta.png"
              alt="Image 2"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Amazon.png"
              alt="Image 3"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Netflix.png"
              alt="Image 4"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Mic.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Airbnb.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
            <img
              src="Op.png"
              alt="Image 5"
              className="w-28 h-32 sm:w-32 sm:h-36 object-contain"
            />
          </motion.div>
        </div>

        <div className="flex items-center justify-center mb-40">
          <img src="Map1.png" alt="" />
        </div>
      </div>

      <div data-aos="fade">
        <div className="max-w-3xl mx-auto p-4 space-y-4 mb-24">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden bg-[#0b0f1c] shadow-cyan-500/40 shadow-sm"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center text-white hover:bg-[#0b0f1c]"
              >
                <span className="text-lg">{item.question}</span>
                <span className="text-2xl font-medium">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 text-gray-300 bg-[#0b0f1c]">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div data-aos="fade">
        <div className="w-full bg-[#0b0f1c] text-white py-16 px-4 overflow-hidden mb-24">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center text-sm mb-20">
              <button className="bg-[#1c2438] hover:bg-[#2a3349] transition-colors duration-300 text-white font-medium py-2 px-8 rounded-lg mb-8 shadow-lg">
                GETTING STARTED
              </button>
              <h2 className="text-3xl md:text-[38px] font-bold mb-6 tracking-tight">
                Master the Interview{" "}
                <span className="relative">
                  Process
                  <div className="h-1 w-24 md:w-36 bg-[#233257] absolute left-1/2 -translate-x-1/2 mt-1"></div>
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Get started with our platform in four simple steps and transform your interview preparation experience
                forever.
              </p>
            </div>

            {/* Steps with connecting line */}
            <div className="relative">
              {/* Single Connecting Line - Only visible on desktop */}
              <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#162040] via-[#4d7eff] to-[#162040] transform -translate-y-1/2 z-0"></div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="bg-[#111827] border border-[#1f2b47] rounded-xl p-8 transition-all duration-300 hover:border-[#3b4f83] hover:-translate-y-2 hover:shadow-[0_10px_25px_-5px_rgba(77,126,255,0.3)] mx-auto w-[360px] min-h-[320px] sm:w-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#1e2b4d] rounded-full p-1 w-16 h-16 flex items-center justify-center shadow-[0_0_20px_rgba(30,43,77,0.5)] relative z-10 ">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-center text-gray-400 mb-5 text-sm font-medium">Step 1</h3>
                  <h4 className="text-center text-2xl font-bold mb-4">Create Account</h4>
                  <p className="text-center text-gray-300 text-base flex-grow">
                    Sign up with your email or social media accounts to get full access to all features.
                  </p>
                </div>


                {/* Step 2 */}
                <div className="bg-[#111827] border border-[#1f2b47] rounded-xl p-8 transition-all duration-300 hover:border-[#3b4f83] hover:-translate-y-2 hover:shadow-[0_10px_25px_-5px_rgba(77,126,255,0.3)] mx-auto w-[360px] min-h-[320px] sm:w-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#1e2b4d] rounded-full p-1 w-16 h-16  flex items-center justify-center shadow-[0_0_20px_rgba(30,43,77,0.5)] relative z-10">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-center text-gray-400 mb-5 text-sm font-medium">Step 2</h3>
                  <h4 className="text-center text-2xl font-bold mb-4">Setup Your Interview</h4>
                  <p className="text-center text-gray-300 text-base flex-grow">
                    Choose your interview type, difficulty level, and schedule a time that works for you.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-[#111827] border border-[#1f2b47] rounded-xl p-8 transition-all duration-300 hover:border-[#3b4f83] hover:-translate-y-2 hover:shadow-[0_10px_25px_-5px_rgba(77,126,255,0.3)] mx-auto w-[360px] min-h-[320px] sm:w-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#1e2b4d] rounded-full p-1 w-16 h-16  flex items-center justify-center shadow-[0_0_20px_rgba(30,43,77,0.5)] relative z-10">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-center text-gray-400 mb-5 text-sm font-medium">Step 3</h3>
                  <h4 className="text-center text-2xl font-bold mb-4">Get the Feedback</h4>
                  <p className="text-center text-gray-300 text-base flex-grow">
                    Receive detailed feedback on your performance with actionable insights for improvement.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-[#111827] border border-[#1f2b47] rounded-xl p-8 transition-all duration-300 hover:border-[#3b4f83] hover:-translate-y-2 hover:shadow-[0_10px_25px_-5px_rgba(77,126,255,0.3)] mx-auto w-[360px] min-h-[320px] sm:w-full flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="bg-[#1e2b4d] rounded-full p-1 w-16 h-16  flex items-center justify-center shadow-[0_0_20px_rgba(30,43,77,0.5)] relative z-10">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-center text-gray-400 mb-5 text-sm font-medium">Step 4</h3>
                  <h4 className="text-center text-2xl font-bold mb-4">Boost Your Confidence</h4>
                  <p className="text-center text-gray-300 text-base flex-grow">
                    Practice with our platform regularly to build confidence and ace your real interviews.
                  </p>
                </div>
              </div>

              {/* Mobile step connector (vertical line) */}
              <div className="lg:hidden absolute left-1/2 top-20 bottom-20 w-0.5 bg-gradient-to-b from-[#162040] via-[#4d7eff] to-[#162040] transform -translate-x-1/2 z-0 md:hidden"></div>
            </div>
          </div>
        </div>
      </div>

          
      <ContactPage />

      <div className="bg-[#0b0f1c] text-white text-center py-12 pt-32">
        {/* Headline Section */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Take charge of your career
        </h1>
        <p className="text-gray-400 text-lg mb-6">
          Get ready to become the best candidate for your dream job
        </p>

        {/* Call To Action Button */}
        <button className="px-10 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-medium text-white mb-12 transition-transform transform hover:scale-105 active:scale-95 shadow-lg">
          Try a Free Mock Interview Now
        </button>
      </div>
    </div>
  );
}
