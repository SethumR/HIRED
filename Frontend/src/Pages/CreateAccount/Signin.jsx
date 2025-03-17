import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Error message component
const ErrorMessage = ({ message }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="text-red-500 text-sm mt-1 text-center"
  >
    {message}
  </motion.p>
);

const EmailStep = ({ email, setEmail, error, handleNext }) => {
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);
  const [isHoveringGithub, setIsHoveringGithub] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle email check
  const handleEmailCheck = () => {
    setLoading(true);
    setErrorMessage("");

    // Trim and validate email format
    const trimmedEmail = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    console.log("Sending email for validation:", trimmedEmail);

    // Send only the email field in the request body
    const payload = { email: trimmedEmail };
    console.log("Sending payload to /auth/check-email:", JSON.stringify(payload));

    fetch("http://localhost:8000/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (res.status === 404) {
          return res.json().then((data) => {
            throw new Error(data.detail || "User not found. Please sign up first.");
          });
        }
        if (!res.ok) {
          throw new Error("Error checking email");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from /auth/check-email:", data);
        if (data.exists) {
          handleManualLogin();
        }
      })
      .catch((err) => {
        console.error("Error in handleEmailCheck:", err);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle manual login
  const handleManualLogin = () => {
    setLoading(true);
    setErrorMessage("");

    const payload = { email: email.trim(), password };
    console.log("Sending payload to /auth/signin:", JSON.stringify(payload));

    fetch("http://localhost:8000/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (res.status === 400) {
          return res.json().then((data) => {
            throw new Error(data.detail || "Invalid password.");
          });
        }
        if (!res.ok) {
          throw new Error("Login failed. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from /auth/signin:", data);
        if (data.message === "Login successful") {
          alert("Login successful! Welcome, " + data.user.name);
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email }));
          window.dispatchEvent(new Event("storage"));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Error in handleManualLogin:", err);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle Google login
  const handleGoogleSuccess = (response) => {
    console.log("Google Token:", response.credential);
    setLoading(true);

    fetch("http://localhost:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (res.status === 404) {
          return res.json().then((data) => {
            throw new Error(data.detail || "User not found. Please sign up first.");
          });
        }
        if (!res.ok) {
          throw new Error("Login failed. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from /auth/google:", data);
        if (data.message === "Login successful") {
          alert("Login successful! Welcome, " + data.user.name);
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email }));
          window.dispatchEvent(new Event("storage"));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Error in handleGoogleSuccess:", err);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle GitHub login
  const handleGitHubLogin = (response) => {
    console.log("GitHub Token:", response.code);
    setLoading(true);

    fetch("http://localhost:8000/auth/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: response.code }),
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (res.status === 404) {
          return res.json().then((data) => {
            throw new Error(data.detail || "User not found. Please sign up first.");
          });
        }
        if (!res.ok) {
          throw new Error("Login failed. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from /auth/github:", data);
        if (data.message === "Login successful") {
          alert("Login successful! Welcome, " + data.user.name);
          localStorage.setItem("user", JSON.stringify({ name: data.user.name, email: data.user.email }));
          window.dispatchEvent(new Event("storage"));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Error in handleGitHubLogin:", err);
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <GoogleOAuthProvider clientId="398939151341-4ag0pbfsmaqnseclup9ntm9dhs2m2isa.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-4">
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50"
        >
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-center mb-6">Unlock Your Access</h1>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@domain.com"
              className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <AnimatePresence>
              {error && <ErrorMessage message={error} />}
            </AnimatePresence>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEmailCheck}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 font-bold rounded-lg mb-4 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out shadow-lg text-white"
          >
            Next
          </motion.button>

          <AnimatePresence>
            {errorMessage && <ErrorMessage message={errorMessage} />}
          </AnimatePresence>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-600/50" />
            <span className="text-sm text-gray-400">or continue with</span>
            <div className="h-px flex-1 bg-gray-600/50" />
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <motion.div
              className="w-full"
              onHoverStart={() => setIsHoveringGoogle(true)}
              onHoverEnd={() => setIsHoveringGoogle(false)}
            >
              <div
                className={`relative w-full transition-all duration-300 ease-in-out
                ${isHoveringGoogle ? "transform scale-[1.02]" : ""}`}
              >
                <GoogleLogin
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

            <motion.div
              className="w-full"
              onHoverStart={() => setIsHoveringGithub(true)}
              onHoverEnd={() => setIsHoveringGithub(false)}
            >
              <div
                className={`relative overflow-hidden transition-all duration-300 ease-in-out mb-4
                ${isHoveringGithub ? "transform scale-[1.02]" : ""}`}
              >
                <GitHubLogin
                  clientId="Ov23liujKfeX3V2GnVZs"
                  onSuccess={handleGitHubLogin}
                  onFailure={(error) => console.error(error)}
                  redirectUri="http://localhost:8000/auth/github"
                  className="w-full py-2 px-4 flex items-center justify-center relative bg-white border border-gray-200 rounded-lg text-gray-800 font-medium text-sm shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FaGithub className="absolute left-3 w-5 h-5" />
                  <span className="mx-auto pl-7">Continue with GitHub</span>
                </GitHubLogin>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gray-600/50" />
          </div>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:underline"
            >
              Sign Up Here
            </a>
          </p>

          <div className="mt-4 text-xs text-gray-500 text-center">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a> and{" "}
            <a href="#" className="text-gray-400 hover:underline">Terms of Service</a> apply.
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default EmailStep;