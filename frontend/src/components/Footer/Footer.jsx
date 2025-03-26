import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/career-guide" className="hover:text-white">Career Guide</Link></li>
              <li><Link to="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/mentors" className="hover:text-white">Mentors</Link></li>
              <li><Link to="/students" className="hover:text-white">Students</Link></li>
              <li><Link to="/companies" className="hover:text-white">Companies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: <a href="mailto:support@platform.com" className="hover:text-white">support@platform.com</a></li>
              <li>Phone: <a href="tel:+15551234567" className="hover:text-white">+1 (555) 123-4567</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-500">
          © 2025 Student-Industry Network Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
