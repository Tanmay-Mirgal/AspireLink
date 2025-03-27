import React, { useState } from "react";
import {
  Menu,
  Search,
  Home,
  Send,
  Cloud,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import LanguageSelector from "@/pages/LanguageSelector";

const MinimalistSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { icon: <Search />, key: "search", path: "/search" },
    { icon: <Home />, key: "home", path: "/" },
    { icon: <Users />, key: "users", path: "/users" },
    { icon: <Settings />, key: "settings", path: "/settings" },
    { icon: <Send />, key: "login", path: "/login" },
    { icon: <Cloud />, key: "signup", path: "/signup" },
    { icon: <LogOut />, key: "logout", path: "/logout" },
  ];

  return (
    <div
      className={`
        h-full bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 fixed left-0 top-0 transition-all duration-300
        ${isExpanded ? "w-64" : "w-16"}
      `}
    >
      {/* Hamburger Menu */}
      <button
        className="text-gray-400 hover:text-white self-end mr-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Menu />
      </button>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-4 w-full px-2">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.key}
            className={({ isActive }) => `
              p-2 rounded-lg transition-all duration-300 flex items-center
              ${isActive ? "bg-gray-700 text-purple-400" : "text-gray-400 hover:text-white"}
            `}
          >
            {({ isActive }) => (
              <>
                <span className="mr-3">{item.icon}</span>
                {isExpanded && <span>{item.key.charAt(0).toUpperCase() + item.key.slice(1)}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Language Selector */}
      <div className="mt-auto w-full ">
        <LanguageSelector />
      </div>

      {/* Profile Image at Bottom */}
      <div className="pb-4 flex items-center">
        <img
          src="/api/placeholder/40/40"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-white/20"
        />
        {isExpanded && <span className="ml-3 text-sm text-gray-300">Profile</span>}
      </div>
    </div>
  );
};

export default MinimalistSidebar;