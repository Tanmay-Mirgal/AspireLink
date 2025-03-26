import React from 'react';
import { Users, BookOpen } from 'lucide-react';

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
        <Users className="w-8 h-8 text-purple-400 mb-2" />
        <div className="text-3xl font-bold text-purple-300">500+</div>
        <div className="text-gray-400">Students Mentored</div>
      </div>
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
        <BookOpen className="w-8 h-8 text-purple-400 mb-2" />
        <div className="text-3xl font-bold text-purple-300">15+</div>
        <div className="text-gray-400">Publications</div>
      </div>
    </div>
  );
}