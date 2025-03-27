import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useForumStore} from '@/store/useFormStore';
import {useAuthStore} from '@/store/useAuthStore';

const useForumActions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const messageEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newForumData, setNewForumData] = useState({ title: '', description: '' });
  const [activeTab, setActiveTab] = useState('all');

  // Auth state
  const { user } = useAuthStore();

  // Forum state and actions
  const { 
    forums, 
    currentForum, 
    isLoading, 
    fetchAllForums, 
    fetchForumById, 
    createForum, 
    joinForum, 
    sendMessage 
  } = useForumStore();

  // Fetch all forums on initial load
  useEffect(() => {
    fetchAllForums();
  }, [fetchAllForums]);

  // Fetch forum details if ID is available
  useEffect(() => {
    if (id) {
      fetchForumById(id);
    }
  }, [id, fetchForumById]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentForum?.messages]);

  // Handle create forum submission
  const handleCreateForum = async (formData) => {
    try {
      const forum = await createForum(formData.title, formData.description);
      setIsCreateDialogOpen(false);
      setNewForumData({ title: '', description: '' });
      navigate(`/forums/${forum._id}`);
      return true;
    } catch (error) {
      console.error('Failed to create forum:', error);
      return false;
    }
  };

  // Handle joining a forum
  const handleJoinForum = async (forumId) => {
    try {
      await joinForum(forumId);
      return true;
    } catch (error) {
      console.error('Failed to join forum:', error);
      return false;
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content) => {
    if (!content.trim()) return false;
    
    try {
      await sendMessage(id, content);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  // Function to safely get initials from a name for avatar fallback
  const getInitials = (name) => {
    // Return a default if name is not a valid string
    if (!name || typeof name !== 'string') return 'U';
    
    // Split the name and get initials
    try {
      return name.split(' ').map(part => part[0]).join('').toUpperCase();
    } catch (error) {
      console.error('Error getting initials:', error);
      return 'U';
    }
  };

  // Safely get user data - handles null/undefined
  const getUserName = (user) => {
    if (!user) return '';
    return typeof user.fullName === 'string' ? user.fullName : '';
  };

  // Filter forums based on active tab
  const filteredForums = forums.filter(forum => {
    if (activeTab === 'all') return true;
    if (activeTab === 'joined') return forum.members?.some(member => member?._id === user?._id);
    if (activeTab === 'created') return forum.mentorId?._id === user?._id;
    return true;
  });

  // Check if user is a member of the current forum
  const isCurrentForumMember = currentForum?.members?.some(member => 
    member?._id === user?._id || currentForum?.mentorId?._id === user?._id
  );

  return {
    // State
    message,
    setMessage,
    activeTab,
    setActiveTab,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newForumData,
    setNewForumData,
    filteredForums,
    isCurrentForumMember,
    messageEndRef,
    
    // Actions
    handleCreateForum,
    handleJoinForum,
    handleSendMessage,
    
    // Utilities
    getInitials,
    getUserName,
    navigate
  };
};

export default useForumActions;