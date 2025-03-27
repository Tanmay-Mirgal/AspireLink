import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';

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

  joinForum: async (forumId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/forums/join-forum/${forumId}`);
      
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

  sendMessage: async (forumId, content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/forums/send-message/${forumId}`, { content });
      
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

  setPage: (page) => set({ page }),
  clearError: () => set({ error: null }),
  resetCurrentForum: () => set({ currentForum: null }),
}));

