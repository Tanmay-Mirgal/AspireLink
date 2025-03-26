import React from 'react';
import { Star } from 'lucide-react';

export function About() {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
        <Star className="text-purple-400" />
        <span>About Me</span>
      </h2>
      <p className="text-gray-300 leading-relaxed">
        As a Computer Science Professor with over a decade of experience, I specialize in Machine Learning and Algorithm Design. My passion lies in bridging the gap between theoretical computer science and practical applications, helping students develop both strong fundamentals and real-world problem-solving skills.
      </p>
    </div>
  );
}