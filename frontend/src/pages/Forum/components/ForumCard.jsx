import React from 'react';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';



export const ForumCard= ({ id, title, description, memberCount }) => {
  return (
    <Link to={`/forum/${id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-gray-500">
          <Users size={18} className="mr-2" />
          <span>{memberCount} members</span>
        </div>
      </div>
    </Link>
  );
};