import React from 'react';
import { format } from 'date-fns';
import {useAuthStore} from '@/store/useAuthStore';
import useForumActions from '../components/useForumActions';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MessageItem = ({ message }) => {
  const { user } = useAuthStore();
  const { getInitials, getUserName } = useForumActions();
  
  const isCurrentUser = message.sender?._id === user?._id;
  const senderName = getUserName(message.sender);
  
  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
      {!isCurrentUser && (
        <Avatar className="border border-gray-800">
          <AvatarFallback className="bg-indigo-900 text-indigo-100">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
        <div 
          className={`p-3 rounded-lg ${
            isCurrentUser 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-800 text-gray-100'
          }`}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {!isCurrentUser && (
            <span className="font-medium text-indigo-400">
              {senderName}
            </span>
          )}
          <span>
            {message.timestamp && format(new Date(message.timestamp), 'MMM d, h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;