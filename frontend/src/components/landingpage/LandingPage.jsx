import React from 'react';
import { 
  ArrowRight, 
  Play, 
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
      icon: <Users className="text-purple-500" size={48} />,
      title: "Resume Analyzer",
      description: "Advanced AI-powered tool that provides comprehensive insights and optimization recommendations for your professional resume."
    },
    {
      icon: <BookOpen className="text-green-500" size={48} />,
      title: "Mock Interviews",
      description: "Realistic interview simulations with AI feedback, helping you build confidence and improve your communication skills."
    },
    {
      icon: <Target className="text-blue-500" size={48} />,
      title: "Skill Matching",
      description: "Intelligent algorithm that aligns your skills with industry demands and personalized career opportunities."
    },
    {
      icon: <Briefcase className="text-orange-500" size={48} />,
      title: "Career Tracker",
      description: "Comprehensive dashboard to monitor your professional growth, set goals, and track your career progression."
    },
    {
      icon: <MessageCircle className="text-teal-500" size={48} />,
      title: "Mentorship",
      description: "Connect with experienced professionals who provide personalized guidance and industry insights."
    },
    {
      icon: <Rocket className="text-red-500" size={48} />,
      title: "Job Opportunities",
      description: "Curated job listings and networking connections tailored to your skills and career aspirations."
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
                {[1,2,3,4,5,6].map((item) => (
                  <div 
                    key={item} 
                    className="bg-[#1A1A2E] h-24 rounded-lg 
                    opacity-80 flex items-center justify-center"
                  >
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details Section */}
      <div className="py-24 px-6 md:px-24 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Comprehensive Career Development Platform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore the powerful tools designed to transform your professional journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#1A1A2E] p-8 rounded-2xl 
                  transform transition-all duration-300 
                  hover:-translate-y-4 hover:shadow-2xl"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
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
    </div>
  );
};

export default LandingPage;