import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useForumStore} from '@/store/useFormStore';
import useForumActions from '../components/useForumActions';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const ForumHeader = () => {
  const navigate = useNavigate();
  const { currentForum } = useForumStore();
  const { getUserName } = useForumActions();
  
  return (
    <div className="p-4 border-b border-gray-800 bg-gray-900/80">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800" 
          onClick={() => navigate('/forums')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">{currentForum?.topic}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            Created by{' '}
            <span className="text-indigo-400">
              {getUserName(currentForum?.mentorId)}
            </span>
            <Badge variant="outline" className="ml-2 bg-gray-800 text-gray-300 border-gray-700">
              {currentForum?.members?.length || 0} members
            </Badge>
          </div>
        </div>
      </div>
      {currentForum?.description && (
        <p className="text-gray-400 text-sm mt-2 pl-4 md:pl-0 border-l-2 border-gray-700 md:border-0">
          {currentForum.description}
        </p>
      )}
    </div>
  );
};

export default ForumHeader;