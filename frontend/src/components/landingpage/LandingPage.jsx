import React from 'react';
import { 
  ArrowRight, 
  Play, 
  CheckCircle, 
  Users, 
  BookOpen, 
  Target, 
  Rocket, 
  Briefcase, 
  MessageCircle, 
  Award 
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="text-purple-500" size={32} />,
      title: "Mentorship Network",
      description: "Connect with industry experts and professional mentors"
    },
    {
      icon: <BookOpen className="text-purple-500" size={32} />,
      title: "Skill Development",
      description: "Personalized learning paths and skill assessments"
    },
    {
      icon: <Target className="text-purple-500" size={32} />,
      title: "Career Tracking",
      description: "Monitor progress and set professional goals"
    }
  ];

  const howItWorks = [
    {
      icon: <Rocket className="text-purple-500" size={32} />,
      title: "Create Profile",
      description: "Build a comprehensive professional profile"
    },
    {
      icon: <Briefcase className="text-purple-500" size={32} />,
      title: "Skill Matching",
      description: "Get matched with relevant opportunities"
    },
    {
      icon: <MessageCircle className="text-purple-500" size={32} />,
      title: "Mentor Connect",
      description: "Engage with industry professionals"
    },
    {
      icon: <Award className="text-purple-500" size={32} />,
      title: "Career Growth",
      description: "Continuous learning and development"
    }
  ];

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <div className="min-h-screen px-6 md:px-24 flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="bg-purple-600/20 inline-block px-4 py-2 rounded-full text-purple-400">
              New Platform Release
            </div>
            
            <h1 className="text-6xl font-bold leading-tight text-white">
              Accelerate Your 
              Career Journey
            </h1>
            
            <p className="text-gray-400 text-xl pr-12">
              A comprehensive platform connecting students with mentors, 
              industry experts, and career opportunities through innovative 
              skill assessment and networking tools.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button className="bg-purple-600 text-white 
                px-6 py-3 rounded-lg flex items-center 
                hover:bg-purple-700 transition">
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </button>
              
              <button className="border border-gray-800 text-white
                px-6 py-3 rounded-lg flex items-center 
                hover:bg-gray-900 transition">
                <Play className="mr-2 text-purple-500" size={20} />
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="relative">
            <div className="bg-[#0F0F1A] rounded-2xl p-6 
              border border-gray-800/50 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 relative z-10">
                {[
                  'Resume\nAnalyzer', 
                  'Mock\nInterviews', 
                  'Skill\nMatching', 
                  'Career\nTracker', 
                  'Mentorship', 
                  'Job\nOpportunities'
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-[#1A1A2E] h-24 rounded-lg 
                    opacity-80 flex items-center justify-center text-center p-2"
                  >
                    <span className="text-xs text-gray-300 whitespace-pre-line text-center">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 md:px-24 bg-[#0A0A0F]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#1A1A2E] p-6 rounded-lg hover:bg-[#2A2A3E] transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-6 md:px-24 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div 
                key={index} 
                className="bg-[#0F0F1A] p-6 rounded-lg text-center hover:bg-[#1A1A2E] transition"
              >
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials or Call to Action Section */}
      <div className="py-20 px-6 md:px-24 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students who have accelerated their career growth 
            with our comprehensive platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-purple-600 text-white 
              px-8 py-4 rounded-lg flex items-center 
              hover:bg-purple-700 transition text-lg">
              Create Free Account
              <ArrowRight className="ml-2" size={24} />
            </button>
            <button className="border border-gray-800 text-white
              px-8 py-4 rounded-lg flex items-center 
              hover:bg-gray-900 transition text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

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
  );
};

export default LandingPage;