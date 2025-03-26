import React from 'react'

const Footer = () => {
  return (
    <div>
          {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 px-6 md:px-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>About Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Career Guide</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Mentors</li>
              <li>Students</li>
              <li>Companies</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@platform.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 text-gray-500">
          © 2025 Student-Industry Network Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Footer