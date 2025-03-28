import React, { useState, useEffect } from "react";
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
  UserPlus,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "../../pages/LanguageSelector"; // adjust the path as needed

const ModernNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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
    <header className="top-0 h-[80px] py-2 z-50 w-full border-b bg-black text-white shadow-md">
      <div className="flex justify-between h-16 items-center px-5">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <Cloud className="h-6 w-6 text-primary" />
          <Link to={"/"} className="hidden text-white font-bold text-xl sm:inline-block">
            TreeTex
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-1">
          {user && navItems.map((item) => (
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
        {user &&   <button
            onClick={() => user.role === "student" ? navigate("/student-dashboard") : navigate("/mentor-dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dark"
          >
            <Users className="h-4 w-4" />
            {user.role === "student" ? "Student Dashboard" : "Mentor Dashboard"}
          </button>}
          <div className="h-6 w-px bg-gray-300" />

          {user ? (
            <>
              <span className="text-sm text-white">Hello, {user.fullName.firstName} {user.fullName.lastName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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

            {/* Mobile User Section */}
            {user ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-4 px-5 py-3 border-b text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-3 border-b text-gray-600 hover:bg-gray-50"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-3 border-b text-gray-600 hover:bg-gray-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}

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
