import React from 'react';
import { Download, MessageCircle, GraduationCap, MapPin, Mail } from 'lucide-react';

export function Header() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-black/80 z-10"></div>
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-48 h-48 rounded-2xl overflow-hidden ring-4 ring-purple-500/30 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80"
                alt="Emily Rodriguez"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Emily Rodriguez
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span>Computer Science Professor</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>Cambridge, MA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>emily.rodriguez@university.edu</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 transition transform hover:scale-105">
                  <Download className="w-5 h-5" />
                  <span>Download CV</span>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 transition transform hover:scale-105">
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Me</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}