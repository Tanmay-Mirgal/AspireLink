import React from 'react';
import { Code } from 'lucide-react';

const skills = [
  'Machine Learning',
  'Algorithm Design',
  'Data Structures',
  'Python',
  'React',
  'System Architecture',
];

export function Expertise() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <Code className="text-purple-400" />
        <span>Areas of Expertise</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span 
            key={skill}
            className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 rounded-xl text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}