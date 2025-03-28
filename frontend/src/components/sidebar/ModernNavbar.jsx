import React, { useState } from "react";
import { 
  Menu, 
  Home, 
  Send, 
  Cloud, 
  Users, 
  Briefcase,
  ChevronDown,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector from "../../pages/LanguageSelector"; // adjust the path as needed

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { icon: <Home className="h-4 w-4" />, key: "home", path: "/" },
    { icon: <Menu className="h-4 w-4" />, key: "forum", path: "/forum" },
    { icon: <Users className="h-4 w-4" />, key: "community", path: "/feed" },
    { icon: <Briefcase className="h-4 w-4" />, key: "jobs", path: "/jobs" },
    { icon: <Briefcase className="h-4 w-4" />, key: "projects", path: "/projects" }
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-black text-white shadow-md">
      <div className="flex justify-between h-16 items-center px-5">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <Cloud className="h-6 w-6 text-primary" />
          <span className="hidden text-white font-bold text-xl sm:inline-block">
           TreeTex
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`
                relative flex items-center gap-2 px-3 py-2 text-sm 
                 text-white
              `}
            >
              {item.icon}
              <span>{item.key.charAt(0).toUpperCase() + item.key.slice(1)}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />

          <div className="h-6 w-px bg-gray-300" />

          <Link 
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-700"
          >
            <Send className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-5 py-3 border-b text-gray-600 hover:bg-gray-50"
              >
                {item.icon}
                <span>{item.key.charAt(0).toUpperCase() + item.key.slice(1)}</span>
              </Link>
            ))}

            {/* Mobile Sign In */}
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 px-5 py-3 border-b text-gray-600 hover:bg-gray-50"
            >
              <Send className="h-4 w-4" />
              <span>Sign In</span>
            </Link>

            {/* Mobile Language Selector */}
            <div className="px-5 py-3 border-b">
              <LanguageSelector />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ModernNavbar;
