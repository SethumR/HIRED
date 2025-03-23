"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  RiDashboardLine, RiVideoAddLine, RiHistoryLine, 
  RiFileTextLine, RiSettings4Line, RiMenu2Line, 
  RiCloseLine, RiArrowLeftSLine, RiArrowRightSLine
} from "react-icons/ri";

const Sidebar = ({ userProfile = {} }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true"; 
  });

  // Save `isCollapsed` state when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  // Default profile data if no userProfile is passed
  const defaultProfile = {
    name: "Sarah Wilson",
    email: "sarah.wilson@gmail.com",
    initials: "SW",
    profilePicture: null,
  };

  // Merge userProfile with defaults (if any field is missing, use default)
  const profile = { ...defaultProfile, ...userProfile };

  const navItems = [
    { name: "Dashboard", route: "/dashboard", icon: <RiDashboardLine className="text-xl" /> },
    { name: "Start Mock Interview", route: "/interview", icon: <RiVideoAddLine className="text-xl" /> },
    { name: "Interview History", route: "/interview-history", icon: <RiHistoryLine className="text-xl" /> },
    { name: "Generate Script", route: "/uploadcv", icon: <RiFileTextLine className="text-xl" /> },
    { name: "Settings", route: "/editprofile", icon: <RiSettings4Line className="text-xl" /> }
  ];

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when sidebar is open
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-[#1e293b] text-white shadow-lg"
        >
          {isMobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenu2Line size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-full bg-[#0b0f1c] p-4 flex flex-col border-r border-white/30 
          transition-all duration-200 ease-in-out overflow-hidden pt-24
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
        style={{minWidth: isCollapsed ? "4rem" : "16rem"}}
      >
        {/* Profile Section & Toggle Button */}
        <div className="pt-8 flex items-center justify-between mb-8 transition-all">
          <div className="flex items-center">
            {profile.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl mr-4">
                {profile.initials}
              </div>
            )}

            {/* Name & Email should be visible when expanded */}
            {!isCollapsed && (
              <div>
                <h3 className="font-semibold text-white">{profile.name}</h3>
                <p className="text-gray-400 text-sm break-words">{profile.email}</p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-[#1e293b] text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition"
          >
            {isCollapsed ? <RiArrowRightSLine size={24} /> : <RiArrowLeftSLine size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.route}
              className={`flex items-center px-4 py-3 mb-2 rounded-md transition-all font-medium text-base tracking-wide 
                ${isCollapsed ? "justify-center px-0" : "px-4"}
                ${location.pathname === item.route ? "bg-[#1e293b] text-white" : "text-gray-300 hover:bg-gray-900/80"}
              `}
            >
              <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`} >{item.icon}</span>
              {!isCollapsed && item.name}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;