import React from 'react';
import {useForumStore} from '@/store/useFormStore';
import useForumActions from '../components/useForumActions';
import MessageItem from './MessageItem';
import EmptyState from './EmptyState';

import { ScrollArea } from "@/components/ui/scroll-area";

const MessageList = () => {
  const { currentForum } = useForumStore();
  const { messageEndRef } = useForumActions();
  
  // Check if there are messages to display
  const hasMessages = currentForum?.messages && currentForum.messages.length > 0;
  
  return (
    <ScrollArea className="flex-1 p-4 h-[calc(100vh-20rem)] bg-gray-950">
      {!hasMessages ? (
        <EmptyState 
          type="no-messages"
          title="No messages yet"
          description="Be the first to start the conversation!"
        />
      ) : (
        <div className="space-y-4 py-2">
          {currentForum.messages.map((message, index) => (
            <MessageItem 
              key={message._id || index} 
              message={message} 
            />
          ))}
          <div ref={messageEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;