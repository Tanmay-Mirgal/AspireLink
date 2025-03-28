import React, { useState } from "react";
import { 
  Menu, 
  Home, 
  Send, 
  Cloud, 
  Users, 
  Briefcase,
  ChevronDown,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
 const user = JSON.parse(localStorage.getItem('user'));
  // Navigation items
  const navItems = [
    { icon: <Home className="h-4 w-4" />, key: "home", path: "/" },
    { icon: <Menu className="h-4 w-4" />, key: "forum", path: "/forum" },
    { icon: <Users className="h-4 w-4" />, key: "community", path: "/feed" },
    { icon: <Briefcase className="h-4 w-4" />, key: "jobs", path: "/jobs" },
    { icon: <Briefcase className="h-4 w-4" />, key: "projects", path: "/projects" }
  ];

  // Language options
  const languageOptions = [
    { key: "en", label: "English" },
    { key: "es", label: "Spanish" },
    { key: "fr", label: "French" }
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle language dropdown
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  return (
    <header className="top-0 z-50 w-full border-b bg-white">
      <div className="flex justify-between h-16 items-center px-5">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <Cloud className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-xl sm:inline-block">
            Bolt UI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`
                relative flex items-center gap-2 px-3 py-2 text-sm transition-all
                hover:text-primary text-gray-500
              `}
            >
              {item.icon}
              <span>{item.key.charAt(0).toUpperCase() + item.key.slice(1)}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleLanguageDropdown}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <span>English</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.key}
                    onClick={() => {
                      toggleLanguageDropdown();
                      // Handle language change logic
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <Link 
            to="/login"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-700"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
          <Link 
            to="/signup"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-700"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
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
            <div className="relative">
              <button 
                onClick={toggleLanguageDropdown}
                className="flex items-center justify-between w-full px-5 py-3 text-gray-600"
              >
                <div className="flex items-center gap-4">
                  <ChevronDown className="h-4 w-4" />
                  <span>Language</span>
                </div>
                <span>English</span>
              </button>
              {isLanguageDropdownOpen && (
                <div className="bg-gray-50">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.key}
                      onClick={() => {
                        toggleLanguageDropdown();
                        // Handle language change logic
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-600"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ModernNavbar;