import React, { useState, useEffect, useRef } from "react";
import { Star, Video, ChevronRight, ChevronLeft, Play, User, Quote } from "lucide-react";

const FeatureExplorer = () => {
  const [activeFeature, setActiveFeature] = useState("success-stories");
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    // Start the interval
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000); // Change feature every 5 seconds

    // Clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeFeature]);

  const features = [
    {
      id: "success-stories",
      name: "Success Stories",
      icon: <Star className="w-5 h-5" />,
      description: "Discover real experiences from our satisfied users.",
      content: <SuccessStoriesContent />,
    },
    {
      id: "marketing-video",
      name: "Marketing Video",
      icon: <Video className="w-5 h-5" />,
      description: "Engaging marketing videos that showcase our features.",
      content: <MarketingVideoContent />,
    },
  ];

  const additionalFeatures = [
    { name: "Smart Interview Simulation", color: "bg-green-500" },
    { name: "Get Personalized Scripts", color: "bg-blue-500" },
    { name: "Resource for Continuous Learning", color: "bg-yellow-500" },
  ];

  const activeFeatureData = features.find((f) => f.id === activeFeature);

  const handlePrevious = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const currentIndex = features.findIndex((f) => f.id === activeFeature);
    const newIndex = (currentIndex - 1 + features.length) % features.length;
    setActiveFeature(features[newIndex].id);
  };

  const handleNext = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const currentIndex = features.findIndex((f) => f.id === activeFeature);
    const newIndex = (currentIndex + 1) % features.length;
    setActiveFeature(features[newIndex].id);
  };

  return (
    <section id="contact">
      <div className="text-sm">
        <div className="text-center">
          <button className="bg-[#1c2438] hover:bg-[#2a3349] transition-colors duration-300 text-white font-medium py-2 px-8 rounded-lg mb-8 shadow-lg">
            CONTACT US
          </button>
          <h2 className="text-3xl md:text-[38px] font-bold mb-6 tracking-tight">
            Connect{" "}
            <span className="relative inline-block">
              With
              <div className="h-1 w-24 md:w-36 bg-[#233257] absolute left-1/2 -translate-x-1/3 mt-1"></div>
            </span>{" "}
            Us
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Reach out to us today and discover how we can help you enhance your interview skills, offering personalized
            support every step of the way.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto rounded-2xl shadow-xl mb-10">
          {/* Left Panel */}
          <div className="w-full lg:w-[390px] rounded-2xl bg-[#101827] p-6 object-cover border border-opacity-30 border-white shadow-[0_0_1px_rgba(255,255,255,0.5)]">
            <h2 className="text-xl sm:text-lg font-bold mb-2 sm:mb-2">Explore Features</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-8">
              Click on any feature to learn more about how it enhances your booking experience.
            </p>

            <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                    activeFeature === feature.id ? "bg-[#1e293b]" : "hover:bg-[#1e293b]/50"
                  }`}
                >
                  <div className="p-1.5 sm:p-1 rounded-full bg-[#1e293b]/50">{feature.icon}</div>
                  <span className="flex-grow text-sm sm:text-base">{feature.name}</span>
                  {activeFeature === feature.id && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 sm:pt-6 mt-4 sm:mt-6">
              <p className="text-sm sm:text-base mb-3 sm:mb-4">And many more features including:</p>
              <ul className="space-y-2 sm:space-y-3">
                {additionalFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm sm:text-sm">
                    <span className={`w-2 h-2 rounded-full ${feature.color}`}></span>
                    {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-grow relative m-0 sm:m-3 lg:m-4">
            <div className="w-full h-[350px] sm:h-[450px] bg-[#101827] rounded-lg p-4 sm:p-6 relative overflow-hidden">
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              {/* Feature Content */}
              <div className="w-full h-full flex items-center justify-center relative">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      activeFeature === feature.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {feature.content}
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 ">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`w-4 sm:w-6 h-1 rounded-full transition-colors ${
                      activeFeature === feature.id ? "bg-white" : "bg-white/30"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <NewsletterForm />
      </div>
    </section>
  );
};

const SuccessStoriesContent = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAyNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAyLjc5IDQgNCA0IDQtMS43OSA0LTR6bTI0IDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Testimonial 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white/20">
                <img
                  src="https://ylpapp.isb.edu/user/Passport_photo_samples/Sample-1---right.jpg"
                  alt="John Doe"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg">John Doe</h4>
                <p className="text-xs text-blue-300">Software Engineer</p>
              </div>
              <Quote className="ml-auto text-blue-300/50 w-8 h-8" />
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              "This platform transformed my interview preparation. The AI-powered simulations felt like real interviews, and the feedback was incredibly detailed and helpful. It boosted my confidence and helped me improve significantly."
            </p>
            <div className="flex mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-white/20">
                <img
                  src="https://lh5.googleusercontent.com/75RkzHsRU0i-X3qjdRrU4zoq9oNDrZPCHDSM69VSuWC7Ia2NvxRKMU5aqaOfWSfTdUmJIwGhAqYWQLG4MVWuAJb95Ha5wRDmNsqtWyhN4Q_JE788MLiCBqcPR6kfFQ799U7mL-EIXhsLFVf3qVprqEE"
                  alt="Jane Smith"
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg">Jane Smith</h4>
                <p className="text-xs text-blue-300">Product Manager</p>
              </div>
              <Quote className="ml-auto text-blue-300/50 w-8 h-8" />
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              "After using this service for just two weeks, I landed my dream job! The personalized feedback and industry-specific questions made all the difference in my preparation, giving me the edge I needed."
            </p>
            <div className="flex mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketingVideoContent = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Video container with modern styling */}
      <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl group">
        {/* Video thumbnail overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent z-10 group-hover:opacity-75 transition-opacity duration-300"></div>

        {/* Embedded YouTube Video */}
        <iframe
          className="w-full h-full object-cover "
          src="https://www.youtube.com/embed/CPXn9DcyYuE"
          title="YouTube Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Video info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
          <h3 className="text-lg md:text-xl font-bold mb-1">Revolutionize Your Interview Process</h3>
          <p className="text-xs md:text-sm text-gray-300 mb-2">
            See how our AI-powered platform can transform your interview preparation
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <span className="flex items-center mr-4">
              <User className="w-3 h-3 mr-1" /> 10.2K views
            </span>
            <span>3:45 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleValidation = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email (must include @ and .)";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    const formData = { email, message };

    try {
      const response = await fetch("http://0.0.0.0:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail("");
      setMessage("");
      setErrors({});

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      setError("There was an issue submitting your form. Please try again.");
    }
  };

  return (
    <div className="w-88 max-w-[76rem] mx-auto p-8 rounded-xl bg-[#101827] text-white sm:w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl md:text-xl font-bold mb-2">Contact Support Team</h2>
          <p className="text-slate-300 text-base">Contact us for updates, inquiries, and exclusive early access!</p>
        </div>

        <div>
          {isSuccess ? (
            <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center">
              Thank you for subscribing! We'll keep you updated.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col md:flex-row gap-4 mb-1">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full p-3 bg-slate-800 border ${
                      errors.email ? "border-red-500" : "border-slate-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message"
                    className={`w-full p-3 bg-slate-800 border ${
                      errors.message ? "border-red-500" : "border-slate-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 p-3 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>

              {isSuccess && <p className="mt-2 text-green-500 text-sm text-center">Message sent successfully!</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureExplorer;