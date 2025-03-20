import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmailStep from "./Emailsteps";
import AccountStep from "./AccountStep";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    CompanyName: "",
    CompanyAddress: "",
    phone: "",
    username: "",
    password: "",
    Repassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (currentStep === 2) {
      if (!formData.CompanyName) newErrors.CompanyName = "Company name is required";
      if (!formData.CompanyAddress) newErrors.CompanyAddress = "Company address is required";
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
      if (currentStep === 2) {
        alert("Account successfully created!");
        console.log("Form submitted:", formData);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50"
      >
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <EmailStep
              email={formData.email}
              setEmail={(email) => setFormData({ ...formData, email })}
              error={errors.email}
              handleNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <AccountStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          )}
        </AnimatePresence>
        {/* Step indicators */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                currentStep >= step ? "bg-purple-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;