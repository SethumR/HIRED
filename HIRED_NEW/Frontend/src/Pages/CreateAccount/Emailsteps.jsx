import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import GitHubLogin from 'react-github-login'; 
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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

const EmailStep = ({ email, setEmail, error, handleNext }) => {
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);
  const [isHoveringGithub, setIsHoveringGithub] = useState(false);
  const [googleResponse, setGoogleResponse] = useState(null); // Add missing state initialization
  const [loading, setLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const [showLoadingBox, setShowLoadingBox] = useState(false); // Add state for loading box
  const navigate = useNavigate();

  const handleGoogleSuccess = (response) => {
    console.log("Google Token:", response.credential);
    setGoogleResponse(response); // Correct the function call
    setLoading(true); // Set loading to true
    setShowLoadingBox(true); // Show loading box

    fetch("http://localhost:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.message === "Login successful") {
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email })); // Store user info in local storage
          window.dispatchEvent(new Event("storage")); // Trigger storage event to update navbar
          alert("Successfully created an account"); // Add success message
          navigate("/dashboard"); // Redirect to dashboard
        }
        setShowLoadingBox(false); // Hide loading box on success
      })
      .catch((err) => {
        console.error("Error:", err);
        setErrorMessage(err.message); // Set error message
        setLoading(false); // Set loading to false on error
        setShowLoadingBox(false); // Hide loading box on error
      });
  };

  const handleGitHubLogin = (response) => {
    console.log("GitHub Token:", response.code);
    setShowLoadingBox(true); // Show loading box

    fetch("http://localhost:8000/auth/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: response.code }), // Correct the key to 'code'
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.message === "Login successful") {
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email })); // Store user info in local storage
          window.dispatchEvent(new Event("storage")); // Trigger storage event to update navbar
          alert("Successfully created an account"); // Add success message
          navigate("/dashboard"); // Redirect to dashboard
        } else {
          alert("Login failed. Please try again.");
        }
        setShowLoadingBox(false); // Hide loading box on success
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("An error occurred during login.");
        setShowLoadingBox(false); // Hide loading box on error
      });
  };

  return (
    <GoogleOAuthProvider clientId="398939151341-4ag0pbfsmaqnseclup9ntm9dhs2m2isa.apps.googleusercontent.com">
      <motion.div
        key="step1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        {/* Loading Animation */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="loader"></div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-center mb-8">
          Unlock Your Access
        </h1>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AnimatePresence>{error && <ErrorMessage message={error} />}</AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 font-bold rounded-lg mb-6 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out shadow-lg"
        >
          Next
        </motion.button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-600" />
          <span className="text-sm text-gray-400">or continue with</span>
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
          <motion.div 
            className="w-full"
            onHoverStart={() => setIsHoveringGoogle(true)}
            onHoverEnd={() => setIsHoveringGoogle(false)}
          >
            <div className={`
              relative w-full transition-all duration-300 ease-in-out
              ${isHoveringGoogle ? 'transform scale-[1.02]' : ''}
            `}>
              <GoogleLogin
                id="google-login-button"
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
                theme="outline"
                width="100%"
                shape="rectangular"
                locale="en"
                text="continue_with"
                useOneTap
              />
            </div>
          </motion.div>

          {errorMessage && (
            <div className="text-center -mt-2">
              <ErrorMessage message={errorMessage} />
            </div>
          )}

          <motion.div 
            className="w-full"
            onHoverStart={() => setIsHoveringGithub(true)}
            onHoverEnd={() => setIsHoveringGithub(false)}
          >
            <div className={`
              relative overflow-hidden  transition-all duration-300 ease-in-out mb-6
              ${isHoveringGithub ? 'transform scale-[1.02]' : ''}
            `}>
              <GitHubLogin
                clientId="Ov23liujKfeX3V2GnVZs"
                onSuccess={handleGitHubLogin}
                onFailure={(error) => console.error(error)}
                redirectUri="http://localhost:8000/auth/github" // Ensure this matches your GitHub OAuth app settings
                className="w-full py-2 px-4 flex items-center justify-center relative bg-white border border-gray-200 rounded-lg text-gray-800 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                <FaGithub className="absolute left-3 w-5 h-5" />
                <span className="mx-auto pl-7">Continue with GitHub</span>
              </GitHubLogin>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:underline"
          >
            Sign In Here
          </a>
        </p>
        <p className="mt-8 text-xs text-gray-500 text-center">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy?hl=en-US" className="text-gray-400 hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms?hl=en-US" className="text-gray-400 hover:underline">
            Terms of Service
          </a>{" "}
          apply.
        </p>
      </motion.div>
    </GoogleOAuthProvider>
  );
};

export default EmailStep;
