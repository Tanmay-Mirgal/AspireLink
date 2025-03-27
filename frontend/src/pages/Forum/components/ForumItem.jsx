import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useForumActions from '../components/useForumActions';
import {useAuthStore} from '@/store/useAuthStore';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

const ForumItem = ({ forum, handleJoinForum }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthStore();
  const { getInitials, getUserName } = useForumActions();
  
  // Safely get mentor name
  const mentorName = getUserName(forum.mentorId);
  const isActive = id === forum._id;
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg ${
        isActive 
          ? 'bg-gray-800 border-indigo-500' 
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => navigate(`/forums/${forum._id}`)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="border border-gray-700">
            <AvatarFallback className="bg-indigo-900 text-indigo-100">
              {getInitials(mentorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate text-white">{forum.topic}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="h-3 w-3" /> 
              <span>{forum.members?.length || 0} members</span>
            </div>
            {forum.description && (
              <p className="text-sm text-gray-400 mt-1 truncate">
                {forum.description}
              </p>
            )}
          </div>
          {user?.role === 'student' && 
           !forum.members?.some(member => member?._id === user?._id) && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-transparent border-indigo-600 text-indigo-400 hover:bg-indigo-900/20 hover:text-indigo-300"
              onClick={(e) => {
                e.stopPropagation();
                handleJoinForum(forum._id);
              }}
            >
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumItem;