import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EmailStep from "./Emailsteps";
import AccountStep from "./AccountStep";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    password: "",
    Repassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showLoadingBox, setShowLoadingBox] = useState(false); // Add state for loading box

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (currentStep === 2) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.username) newErrors.username = "Username is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.Repassword) {
        newErrors.Repassword = "Passwords do not match";
      }
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setCurrentStep((prev) => prev + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      console.log("Form submitted:", formData);
      alert("Account successfully created!");
      navigate("/dashboard");
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4 relative">
      {showLoadingBox && (
        <div className="fixed top-12 right-2 md:right-4 bg-[#131925] text-white p-3 rounded-lg shadow-lg w-64 md:w-72 font-semibold flex items-center justify-center z-50 border border-white/30 max-w-full">
          <svg className="animate-spin h-5 w-5 mr-2 md:mr-3 text-green-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="text-sm md:text-base">Creating Account...</span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-sm bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50"
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <EmailStep
              email={formData.email}
              setEmail={(email) => setFormData({ ...formData, email })}
              error={errors.email}
              handleNext={handleNext}
              setShowLoadingBox={setShowLoadingBox} // Pass setShowLoadingBox to EmailStep
            />
          )}
          {currentStep === 2 && (
            <AccountStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              handleSubmit={handleSubmit}
              handlePrevious={handlePrevious}
              setShowLoadingBox={setShowLoadingBox} // Pass setShowLoadingBox to AccountStep
            />
          )}
        </AnimatePresence>

        {/* Step indicators */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`w-1.5 h-1.5 rounded-full ${
                currentStep >= step ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;