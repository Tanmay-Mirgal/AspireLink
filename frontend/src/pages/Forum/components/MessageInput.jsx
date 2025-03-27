import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {useForumStore} from '@/store/useFormStore';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from 'lucide-react';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const { isLoading, sendMessage } = useForumStore();
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendMessage(id, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className="border-t border-gray-800 p-4 bg-gray-900">
      <form 
        className="flex w-full items-center gap-2" 
        onSubmit={handleSendMessage}
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;