"use client"

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiDashboardLine, RiVideoAddLine, RiHistoryLine, RiFileTextLine, RiSettings4Line, RiMenu2Line, RiCloseLine } from "react-icons/ri";

const Sidebar = ({ userProfile }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Default user profile if not provided
  const defaultProfile = {
    name: "Sarah Wilson",
    title: "Software Engineer",
    initials: "SW",
  };
  
  // Use provided profile or fall back to default
  const profile = userProfile || defaultProfile;
  
  // Navigation items with their routes and icons
  const navItems = [
    { name: "Dashboard", route: "/dashboard", icon: <RiDashboardLine className="text-xl" /> },
    { name: "Start Mock Interview", route: "/startmock", icon: <RiVideoAddLine className="text-xl" /> },
    { name: "Interview History", route: "/interview-history", icon: <RiHistoryLine className="text-xl" /> },
    { name: "Generate Script", route: "/uploadcv", icon: <RiFileTextLine className="text-xl" /> },
    { name: "Settings", route: "/editprofile", icon: <RiSettings4Line className="text-xl" /> }
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if current route matches nav item route
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-[#1e293b] text-white"
        >
          {isMobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenu2Line size={24} />}
        </button>
      </div>

      {/* Sidebar for mobile (slide in) and desktop */}
      <aside 
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          fixed lg:static top-60 left-0 z-20
          w-64 h-screen bg-[#0b0f1c] p-4 flex flex-col 
          border-r border-opacity-30 border-white
          transition-transform duration-300 ease-in-out 
        `}
      >
        <div className="flex items-center mb-6 mt-20 ">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl mr-4 mt-6">
            {profile.initials}
          </div>
          <div>
            <h3 className="font-semibold mt-6 text-white">{profile.name}</h3>
            <p className="text-gray-400 text-sm">{profile.title}</p>
          </div>
        </div>
        
        <nav className="flex-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.route}
              className={`flex items-center px-4 py-3 mb-2 rounded-md transition-colors font-medium text-base tracking-wide ${
                isActiveRoute(item.route) ? "bg-[#1e293b] text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;