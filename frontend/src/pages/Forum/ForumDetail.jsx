import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Users, MessageCircle, UserPlus, ChevronLeft, Send } from 'lucide-react';
import { useForumStore } from '@/store/useFormStore';

// Extracted as a separate component for better code organization
const MembersSidebar = ({ members, isCollapsed, toggleSidebar }) => (
  <div className={`bg-white border-r shadow-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'}`}>
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          {!isCollapsed && <h2 className="text-lg font-semibold">Members</h2>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={18} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
    
    <div className="p-2 overflow-y-auto max-h-[calc(100vh-120px)]">
      {members.map((member) => (
        <div 
          key={member._id} 
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors mb-1"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {member.fullName.firstName.charAt(0)}
          </div>
          {!isCollapsed && (
            <span className="truncate">
              {`${member.fullName.firstName} ${member.fullName.lastName}`}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Extracted message component for better organization
const Message = React.memo(({ message, isCurrentUser }) => {
  console.log(isCurrentUser);
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} w-full mb-4`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-2">
          {message.sender.fullName.firstName.charAt(0)}
        </div>
      )}
      <div
        className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
          isCurrentUser
            ? 'bg-green-600 text-white rounded-tr-none'
            : 'bg-white border shadow-sm text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-medium ${isCurrentUser ? 'text-green-100' : 'text-gray-700'}`}>
            {isCurrentUser ? 'You' : `${message.sender.fullName.firstName}`}
          </span>
          <span className={`text-xs ${isCurrentUser ? 'text-green-200' : 'text-gray-400'} ml-2`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="break-words">{message.content}</p>
        <span className={`text-xs ${isCurrentUser ? 'text-green-200' : 'text-gray-400'} block text-right mt-1`}>
          {new Date(message.timestamp).toLocaleDateString()}
        </span>
      </div>
      {isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-medium ml-2">
          {message.sender.fullName.firstName.charAt(0)}
        </div>
      )}
    </div>
  );
});


// Enhanced MessageInput component
const MessageInput = ({ forumId, sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    if (message.trim()) {
      sendMessage(forumId, message);
      setMessage('');
    }
  }, [forumId, message, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex items-center space-x-2">
        <textarea
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="1"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export const ForumDetail = () => {
    const { id } = useParams();
    const { currentForum, isLoading, error, fetchForumById, joinForum, sendMessage } = useForumStore();
    const [currentUser, setCurrentUser] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
    // Ref to hold the messages container
    const messagesEndRef = useRef(null);
  
    // Memoize this computation to avoid redundant calculations on re-renders
    const isMember = useMemo(() => {
      if (!currentUser || !currentForum) return false;
      return currentForum.members.some(member => member._id === currentUser._id);
    }, [currentUser, currentForum]);
  
    // Use useCallback to prevent unnecessary re-renders
    const handleJoin = useCallback(async () => {
      if (id && !isMember) {
        try {
          await joinForum(id);
        } catch (error) {
          console.error('Failed to join forum:', error);
        }
      }
    }, [id, joinForum, isMember]);
  
    // Use useCallback to stabilize this function reference
    const handleSendMessage = useCallback((forumId, content) => {
      sendMessage(forumId, content);
    }, [sendMessage]);
  
    const toggleSidebar = useCallback(() => {
      setIsSidebarCollapsed(prev => !prev);
    }, []);
  
    // Fetch user data only once when component mounts
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }, []);
  
    // Fetch forum data when ID changes
    useEffect(() => {
      if (id) {
        fetchForumById(id);
      }
    }, [id, fetchForumById]);
  
    // Scroll to the last message whenever the forum data changes
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [currentForum]);
  
    // Loading state with skeleton UI
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="space-y-4 w-64">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      );
    }
  
    // Error state with better UX
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-red-600 font-medium mb-2">Unable to load forum</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchForumById(id)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }
  
    // Not found state
    if (!currentForum) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-gray-600 mb-4">Forum not found</div>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      );
    }
  
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Members Sidebar */}
        <MembersSidebar 
          members={currentForum.members} 
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white border-b shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{currentForum.topic}</h1>
                <div className="flex items-center mt-1 text-gray-500">
                  <MessageCircle size={16} className="mr-1" />
                  <span className="text-sm">{currentForum.messages.length} messages</span>
                  <span className="mx-2">•</span>
                  <Users size={16} className="mr-1" />
                  <span className="text-sm">{currentForum.members.length} members</span>
                </div>
              </div>
              {!isMember && (
                <button
                  onClick={handleJoin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <UserPlus size={18} className="mr-2" />
                  Join Forum
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-2 max-w-2xl">{currentForum.description}</p>
          </div>
  
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-full">
              {currentForum.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No messages yet. Be the first to start the conversation!</p>
                </div>
              ) : (
                currentForum.messages.map((message) => (
                  <Message 
                    key={message._id} 
                    message={message} 
                    isCurrentUser={currentUser && message.sender._id === currentUser._id} 
                  />
                ))
              )}
              {/* Scroll to this element */}
              <div ref={messagesEndRef}></div>
            </div>
          </div>
  
          {/* Message Input */}
          <MessageInput 
            forumId={currentForum._id} 
            sendMessage={handleSendMessage} 
          />
        </div>
      </div>
    );
  };