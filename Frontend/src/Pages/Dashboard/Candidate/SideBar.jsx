"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiVideoAddLine,
  RiHistoryLine,
  RiFileTextLine,
  RiSettings4Line,
  RiMenu2Line,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiQuestionLine,
} from "react-icons/ri";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    initials: "U",
  });

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || "User",
        email: parsedUser.email || "user@example.com",
        initials: parsedUser.name
          ? parsedUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "U",
      });
    }
  }, []);

  // Save isCollapsed state when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  const navItems = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: <RiDashboardLine className="text-xl" />,
    },
    {
      name: "Start Mock Interview",
      route: "/interview",
      icon: <RiVideoAddLine className="text-xl" />,
    },
    {
      name: "Interview History",
      route: "/interview-history",
      icon: <RiHistoryLine className="text-xl" />,
    },
    {
      name: "Generate Script",
      route: "/uploadcv",
      icon: <RiFileTextLine className="text-xl" />,
    },
    {
      name: "Settings",
      route: "/editprofile",
      icon: <RiSettings4Line className="text-xl" />,
    },
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
      <div className="lg:hidden fixed top-24 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-[#14192c] text-white shadow-lg hover:bg-[#1c2333] transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <RiCloseLine size={24} /> : <RiMenu2Line size={24} />}
        </button>
      </div>

      {/* Sidebar Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0
            min-h-screen flex flex-col
            transition-all duration-300 ease-in-out
            bg-[#0b0f1c] dark:bg-[#0b0f1c]
            shadow-[5px_0_15px_rgba(0,0,0,0.40)]
            backdrop-blur-sm
            bg-opacity-95
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            z-40
          `}
          style={{
            width: isCollapsed ? "5rem" : "16rem",
            minWidth: isCollapsed ? "5rem" : "16rem",
          }}
        >
          {/* Profile Section */}
          <div className="mt-36 px-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4ea3b8] to-[#3acb96] flex items-center justify-center text-white font-medium shadow-md">
                {user.initials}
              </div>

              {!isCollapsed && (
                <div className="ml-3">
                  <h3 className="font-medium text-white text-sm">{user.name}</h3>
                  <p className="text-gray-400 text-xs truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-[#1c2333] text-gray-400 p-1.5 rounded-full hover:bg-[#2a3353] transition-colors shadow-md hover:shadow-lg"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <RiArrowRightSLine size={18} /> : <RiArrowLeftSLine size={18} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-8 px-3 overflow-y-auto">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.route}
                    className={`flex items-center py-3 px-3 rounded-lg transition-all text-[16px]
                      ${isCollapsed ? "justify-center" : ""}
                      ${
                        location.pathname === item.route
                          ? "bg-gradient-to-r from-[#1c2333] to-[#232b42] shadow-md text-white"
                          : "text-gray-300 hover:bg-[#1c2333] hover:text-white hover:shadow-md"
                      }
                    `}
                  >
                    <span
                      className={`${isCollapsed ? "" : "mr-3"} ${
                        location.pathname === item.route ? "text-white" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help & Support */}
          <div className="mt-auto px-3 pb-6 pt-4 border-t border-[#2a3353]">
            <Link
              to=""
              className={`flex items-center py-3 px-3 rounded-lg text-gray-400 hover:bg-[#1c2333] hover:text-white transition-all text-base
                ${isCollapsed ? "justify-center" : ""} hover:shadow-md`}
            >
              <span className={isCollapsed ? "" : "mr-3"}>
                <RiQuestionLine className="text-xl" />
              </span>
              {!isCollapsed && <span>Help & Support</span>}
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;