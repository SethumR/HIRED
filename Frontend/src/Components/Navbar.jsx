"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { FaUserAlt, FaSignOutAlt } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import { Link as ScrollLink } from 'react-scroll';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSignUpDropdownOpen, setIsSignUpDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isMobileSignUpDropdownOpen, setIsMobileSignUpDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const userDropdownRef = useRef(null)
  const signUpDropdownRef = useRef(null)
  const mobileSignUpDropdownRef = useRef(null)
  const mobileUserDropdownRef = useRef(null)
  const navigate = useNavigate()

  // Handle user authentication
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user")
      setUser(updatedUser ? JSON.parse(updatedUser) : null)
    }

    window.addEventListener("storage", handleStorageChange)

    // Check for dark mode preference
    const darkModePreference = localStorage.getItem("darkMode") === "true"
    setIsDarkMode(darkModePreference)
    if (darkModePreference) {
      document.documentElement.classList.add("dark")
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
      if (signUpDropdownRef.current && !signUpDropdownRef.current.contains(event.target)) {
        setIsSignUpDropdownOpen(false)
      }
      if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(event.target)) {
        setIsMobileSignUpDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/") // Navigate to home page after logout
  }

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode
    setIsDarkMode(newDarkModeState)
    localStorage.setItem("darkMode", String(newDarkModeState))

    if (newDarkModeState) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0b0f1c] dark:bg-[#0b0f1c] backdrop-blur-md shadow-lg font-poppins">
      <div className="container mx-auto flex h-24 items-center justify-between px-6 md:px-12">
        {/* Logo Section */}
        <div className="flex items-center justify-center sm:justify-start">
          <Link
            to="/"  // Adjust the route accordingly
            className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400"
          >
            <img
              src="Log.png"
              alt="HIRED Logo"
              className="w-[120px] sm:w-[180px] max-w-full h-auto mt-2 sm:mt-4 -ml-6 sm:-ml-[50px] cursor-pointer"
            />
          </Link>
        </div>
        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex space-x-16 items-center text-base font-medium">
          <Link
              to="/"  // Adjust the route accordingly
              className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer"
            >
              Home
            </Link>
            <ScrollLink
              to="features"  
              smooth={true}
              duration={500}
              offset={-110}   // Adjust scroll duration
              className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer"
            >
              Features
            </ScrollLink>
            <Link to="/aboutus" className="text-white hover:text-purple-400 transition duration-200">
              About Us
            </Link>
            <Link to="/upgrade" className="text-white hover:text-purple-400 transition duration-200">
              Upgrade
            </Link>
            <ScrollLink
              to="contact"  
              smooth={true}
              duration={500}
              offset={-110}   // Adjust scroll duration
              className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer"
            >
              Contact Us
            </ScrollLink>
          </div>
        </nav>

        {/* Dark Mode Toggle + Sign Up/User Profile - Right Aligned */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition duration-200 focus:outline-none flex items-center justify-center 
              ${isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-700 hover:bg-gray-600"}
            `}>
            {isDarkMode ? <MdLightMode className="h-5 w-5 text-white" /> : <MdDarkMode className="h-5 w-5 text-white" />}
          </button>

          {/* User Profile or Sign Up */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                className="transition duration-200 flex items-center space-x-1"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <span className="ml-2 px-2 py-1 text-xs text-green-500 border border-green-500 rounded mr-2">Free</span>
                <span>
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Hi,</span>
                  <span className="text-white"> {user.name?.split(" ")[0] || "User"} !</span>
                </span>
                <motion.div animate={{ rotate: isUserDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    className="absolute left-0 mt-4 w-64 bg-[#131726] rounded-xl overflow-hidden shadow-xl border border-[#232738] z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#232738]">
                      <div className="text-sm text-gray-400">Signed in as</div>
                      <div className="text-white font-medium">{user.name || "User"}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FaUserAlt className="mr-3 h-4 w-4 text-indigo-400" />
                        User Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout()
                          setIsUserDropdownOpen(false)
                        }}
                        className="flex items-center w-full text-left px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4 text-pink-400" />
                        Logout
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-[#0f1320] border-t border-[#232738]">
                      <div className="text-sm text-gray-400">Free Plan</div>
                      <Link
                        to="/upgrade"
                        className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-200"
                      >
                        Upgrade to Pro
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative" ref={signUpDropdownRef}>
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition duration-200 flex items-center space-x-1"
                onClick={() => setIsSignUpDropdownOpen(!isSignUpDropdownOpen)}
              >
                <span>Sign Up</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-500 transition-transform duration-200 ${isSignUpDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isSignUpDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-4 w-64 bg-[#131726] rounded-xl overflow-hidden shadow-xl border border-[#232738] z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#232738]">
                      <div className="text-sm text-gray-400">Create an account</div>
                      <div className="text-white font-medium">Choose your account type</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/signup"
                        className="flex items-center px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                        onClick={() => setIsSignUpDropdownOpen(false)}
                      >
                        <div className="mr-3 h-4 w-4 text-indigo-400">👤</div>
                        Candidates
                      </Link>

                      <Link
                        to="/signupcompany"
                        className="flex items-center px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                        onClick={() => setIsSignUpDropdownOpen(false)}
                      >
                        <div className="mr-3 h-4 w-4 text-pink-400">🏢</div>
                        Companies
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 bg-[#0f1320] border-t border-[#232738]">
                      <div className="text-sm text-gray-400">Already have an account?</div>
                      <Link
                        to="/login"
                        className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-200"
                      >
                        Sign in instead
                        <ChevronDown className="ml-1 h-3 w-3 rotate-270" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Dark Mode Toggle for Mobile */}
          <button
            onClick={toggleDarkMode}
            className={`p-1 rounded-full transition duration-200 focus:outline-none flex items-center justify-center 
              ${isDarkMode ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-700 hover:bg-gray-600"}
            `}>
            {isDarkMode ? <MdLightMode className="h-5 w-5 text-white" /> : <MdDarkMode className="h-5 w-5 text-white" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-purple-400 transition duration-200 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="md:hidden bg-[#0b0f1c] dark:bg-[#0b0f1c] shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center py-6 space-y-6">
              <li>
                <Link
                  to="/"  // Adjust the route accordingly
                  className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                 <ScrollLink
                  to="features"  
                  smooth={true}
                  duration={600}
                  offset={-110}   
                  className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer">
                  Features
                </ScrollLink>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-white hover:text-purple-400 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/upgrade"
                  className="text-white hover:text-purple-400 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upgrade
                </Link>
              </li>
              <li>
              <ScrollLink
              to="contact"  
              smooth={true}
              duration={500}
              offset={-110}   // Adjust scroll duration
              className="text-white hover:text-purple-400 transition duration-200 hover:border-purple-400 cursor-pointer"
            >
              Contact Us
            </ScrollLink>
              </li>

              {/* User Profile or Sign Up for Mobile */}
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                <button
                  className="transition duration-200 flex items-center space-x-1"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span className="ml-2 px-2 py-1 text-xs text-green-500 border border-green-500 rounded mr-2">Free</span>
                  <span>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Hi,</span>
                    <span className="text-white"> {user.name?.split(" ")[0] || "User"} !</span>
                  </span>
                  <motion.div animate={{ rotate: isUserDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-white" />
                  </motion.div>
                </button>
  
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      className="absolute left-0 mt-4 w-64 bg-[#131726] rounded-xl overflow-hidden shadow-xl border border-[#232738] z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-[#232738]">
                        <div className="text-sm text-gray-400">Signed in as</div>
                        <div className="text-white font-medium">{user.name || "User"}</div>
                      </div>
  
                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <FaUserAlt className="mr-3 h-4 w-4 text-indigo-400" />
                          User Dashboard
                        </Link>
  
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsUserDropdownOpen(false)
                          }}
                          className="flex items-center w-full text-left px-4 py-3 text-white hover:bg-[#1c2033] transition duration-200"
                        >
                          <FaSignOutAlt className="mr-3 h-4 w-4 text-pink-400" />
                          Logout
                        </button>
                      </div>
  
                      {/* Footer */}
                      <div className="px-4 py-3 bg-[#0f1320] border-t border-[#232738]">
                        <div className="text-sm text-gray-400">Free Plan</div>
                        <Link
                          to="/upgrade"
                          className="flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition duration-200"
                        >
                          Upgrade to Pro
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              ) : (
                <li className="w-full flex flex-col items-center" ref={mobileSignUpDropdownRef}>
                  <button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text hover:from-purple-600 hover:to-pink-600 transition duration-200 flex items-center space-x-1"
                    onClick={() => setIsMobileSignUpDropdownOpen(!isMobileSignUpDropdownOpen)}
                  >
                    <span>Sign Up</span>
                    <ChevronDown
                      className={`w-5 h-5 text-purple-500 transition-transform duration-200 ${isMobileSignUpDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobileSignUpDropdownOpen && (
                      <motion.div
                        className="mt-4 w-full flex flex-col items-center space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to="/signup"
                          className="text-white hover:text-purple-400 transition duration-200"
                          onClick={() => {
                            setIsMobileSignUpDropdownOpen(false)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          Candidates
                        </Link>
                        <Link
                          to="/signupcompany"
                          className="text-white hover:text-purple-400 transition duration-200"
                          onClick={() => {
                            setIsMobileSignUpDropdownOpen(false)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          Companies
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar