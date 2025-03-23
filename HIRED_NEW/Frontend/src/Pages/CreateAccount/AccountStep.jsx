import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaArrowLeft } from "react-icons/fa";

const inputClasses =
  "w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300";

const buttonClasses =
  "w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500";

const ErrorMessage = ({ message }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="text-red-500 text-sm mt-1"
  >
    {message}
  </motion.p>
);

const AccountStep = ({
  formData,
  setFormData,
  errors,
  handlePrevious,
  setShowLoadingBox, // Add setShowLoadingBox prop
}) => {
  const [loading, setLoading] = useState(false); // Fixed useState usage
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    if (formData.password !== formData.Repassword) {
      setServerError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      setShowLoadingBox(true); // Show loading box
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          lastname: formData.lastName,
          phone_number: formData.phone,
          username: formData.username,
          password: formData.password,
          reconfirm_password: formData.Repassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail === "Email is already registered") {
          setServerError("This email has already been registered.");
        } else {
          setServerError("Registration failed");
        }
        setShowLoadingBox(false); // Hide loading box on error
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      localStorage.setItem("firstName", formData.firstName); // Store first name in local storage

      // Wait for 5 seconds before navigating to the dashboard
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard
      }, 4000);
    } catch (error) {
      console.error("Registration failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.form
        key="step2"
        className="space-y-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleFormSubmit}
      >
        <div className="flex items-center mb-10 justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="cursor-pointer p-2 rounded-full bg-gray-700 mr-4"
          >
            <FaArrowLeft className="text-slate-200 text-lg" />
          </motion.div>
          <h1 className="text-2xl font-bold text-center">Create Account</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
              First name
            </label>
            <input
              type="text"
              id="firstName"
              className={inputClasses}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="John"
            />
            <AnimatePresence>
              {errors.firstName && <ErrorMessage message={errors.firstName} />}
            </AnimatePresence>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              className={inputClasses}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Doe"
            />
            <AnimatePresence>
              {errors.lastName && <ErrorMessage message={errors.lastName} />}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone number
          </label>
          <PhoneInput
            country={"us"}
            value={formData.phone}
            onChange={(phone) => setFormData({ ...formData, phone })}
            inputStyle={{
              width: "100%",
              height: "43px",
              fontSize: "16px",
              backgroundColor: "rgb(31, 41, 55)",
              border: "1px solid rgb(75, 85, 99)",
              color: "white",
              borderRadius: "0.5rem",
            }}
            dropdownStyle={{
              backgroundColor: "rgb(31, 41, 55)",
              color: "white",
            }}
          />
          <AnimatePresence>
            {errors.phone && <ErrorMessage message={errors.phone} />}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={inputClasses}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="username"
          />
          <AnimatePresence>
            {errors.username && <ErrorMessage message={errors.username} />}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={inputClasses}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
          />
          <AnimatePresence>
            {errors.password && <ErrorMessage message={errors.password} />}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="Repassword" className="block text-sm font-medium text-gray-300 mb-1">
            Reconfirm Password
          </label>
          <input
            type="password"
            id="Repassword"
            className={inputClasses}
            value={formData.Repassword}
            onChange={(e) =>
              setFormData({ ...formData, Repassword: e.target.value })
            }
            placeholder="••••••••"
          />
          <AnimatePresence>
            {errors.Repassword && <ErrorMessage message={errors.Repassword} />}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`${buttonClasses} bg-gradient-to-r from-purple-500 to-pink-500`}
          >
            Create Account
          </motion.button>
          {serverError && (
            <div className="text-red-500 text-sm text-center">
              {serverError}
            </div>
          )}
        </div>
      </motion.form>
    </>
  );
};

export default AccountStep;