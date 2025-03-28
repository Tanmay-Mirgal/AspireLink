// src/store/useForumStore.js

import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import { 
  sendMessage as socketSendMessage, 
  joinForumRoom,
  leaveForumRoom
} from '@/lib/socket';

export const useForumStore = create((set, get) => ({
  // State
  forums: [],
  currentForum: null,
  isLoading: false,
  error: null,
  page: 1,
  limit: 10,
  totalForums: 0,

  // Actions
  fetchAllForums: async () => {
    set({ isLoading: true, error: null });
    try {
      const { page, limit } = get();
      const response = await axiosInstance.get(`/forums/all-forums?page=${page}&limit=${limit}`);
      
      set({ 
        forums: response.data.forums,
        totalForums: response.data.total,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch forums',
        isLoading: false 
      });
    }
  },

  fetchForumById: async (forumId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/forums/get-forum/${forumId}`);
      
      // Join the socket room for this forum
      joinForumRoom(forumId);
      
      set({ 
        currentForum: response.data.forum,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch forum details',
        isLoading: false 
      });
    }
  },

  sendMessage: async (forumId, content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/forums/send-message/${forumId}`, { content });
      
      // Get the newly added message (last one in the array)
      const newMessage = response.data.forum.messages[response.data.forum.messages.length - 1];
      
      // Emit the message via socket to notify other users
      socketSendMessage({
        forumId,
        message: newMessage
      });
      
      // Update the current forum with the new message
      set({ 
        currentForum: response.data.forum,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to send message',
        isLoading: false 
      });
      throw error;
    }
  },

  // Add a new action to handle real-time messages
  addSocketMessage: (message) => {
    set(state => {
      if (!state.currentForum) return state;
      
      // Check if the message is already in the forum (to avoid duplicates)
      const messageExists = state.currentForum.messages.some(
        m => m._id === message._id
      );
      
      if (messageExists) return state;
      
      return {
        currentForum: {
          ...state.currentForum,
          messages: [...state.currentForum.messages, message]
        }
      };
    });
  },
  joinForum: async (forumId) => {
    set({ isLoading: true, error: null });
    try {
      // Call the API to join the forum
      const response = await axiosInstance.put(`/forums/join-forum/${forumId}`);
      
      // Join the socket room for this forum
      joinForumRoom(forumId);
      
      // Update the forums list and current forum if it's loaded
      set(state => ({
        forums: state.forums.map(forum => 
          forum._id === forumId 
            ? { ...forum, members: response.data.forum.members }
            : forum
        ),
        currentForum: state.currentForum?._id === forumId 
          ? { ...state.currentForum, members: response.data.forum.members }
          : state.currentForum,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to join forum',
        isLoading: false 
      });
      throw error;
    }
  },

   leaveForum: (forumId) => {
    leaveForumRoom(forumId);
    set({ currentForum: null });
  },

  createForum: async (title, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/forums/create-forum', { title, description });
      // Update the forums list with the new forum
      set(state => ({ 
        forums: [response.data.forum, ...state.forums],
        isLoading: false 
      }));
      return response.data.forum;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create forum',
        isLoading: false 
      });
      throw error;
    }
  },

  setPage: (page) => set({ page }),
  clearError: () => set({ error: null }),
  resetCurrentForum: () => set({ currentForum: null }),
}));