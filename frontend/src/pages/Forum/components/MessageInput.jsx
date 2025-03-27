import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useForumStore } from '@/store/useFormStore';




export const MessageInput = ({ forumId }) => {
  const [message, setMessage] = useState('');
  const sendMessage = useForumStore(state => state.sendMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(forumId, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 max-w-7xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
      >
        <Send size={18} />
        Send
      </button>
    </form>
  );
};