import React from 'react';
import { Award, Briefcase, GraduationCap } from 'lucide-react';

export function Achievements() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <Award className="text-purple-400" />
        <span>Key Achievements</span>
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition group">
          <Briefcase className="w-6 h-6 text-purple-400 mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-purple-200">Research Excellence</h3>
          <p className="text-gray-400">Led groundbreaking research in ML algorithms, published in top journals</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500/50 transition group">
          <GraduationCap className="w-6 h-6 text-purple-400 mb-3" />
          <h3 className="font-semibold text-lg mb-2 text-purple-200">Teaching Impact</h3>
          <p className="text-gray-400">Developed innovative CS curriculum adopted by multiple universities</p>
        </div>
      </div>
    </div>
  );
}