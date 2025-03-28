import { create } from 'zustand';

import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

export const useAuthStore = create((set,get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isLoading: false,
  isError: false,
  error: null,

  signup: async (data) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/register', data);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        isLoading: false,
        isError: false,
        user
      });
      
      toast.success('User registered successfully');
      return user;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/login', data);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        isLoading: false,
        isError: false,
        user
      });
      
      toast.success('User logged in successfully');
      return user;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error.message || 'An unexpected error occurred';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      await axiosInstance.post('/auth/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      set({
        isLoading: false,
        isError: false,
        user: null
      });
      
      toast.success('User logged out successfully');
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  getProfile: async (data) => {
    try {
      set({ isLoading: true });
      
      const response = await axiosInstance.get('/auth/get-profile');
      const { user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      
      set({
        isLoading: false,
        isError: false,
        user
      });
      
      toast.success('Profile fetched successfully');
      return user;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'An unexpected error occurred';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  setRole: async (role) => {
    try {
      // Implement API call to update user role
      const response = await axiosInstance.post('/auth/set-role', { role });
      
      // Update local user data
      const currentUser = get().user;
      const updatedUser = { ...currentUser, role };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser,
        isLoading: false,
        isError: false 
      });

      toast.success(`Role updated to ${role}`);
      return updatedUser;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'Failed to update role';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },


  completeProfile: async (data) => {
    try {
      set({ isLoading: true });
      
      // API call to update profile
      const response = await axiosInstance.post('/auth/complete-profile', data);
      
      // Get the current user from the store
      const currentUser = get().user;
      
      // Create updated user object with new profile data
      const updatedUser = { 
        ...currentUser, 
        ...data 
      };
      
      // Update local storage and store state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser,
        isLoading: false,
        isError: false 
      });

      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'Failed to update profile';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },



  fetchRandomUsers: async () => {
    try {
      set({ isLoading: true });
      
      const response = await axiosInstance.get('/auth/get-random-users');
      const randomUsers = response.data;
      
      set({
        isLoading: false,
        isError: false,
        randomUsers
      });
      
      return randomUsers;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'Failed to fetch random users';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  },

  // Fetch user by ID (if needed)
  fetchUserById: async (userId) => {
    try {
      set({ isLoading: true });
      
      const response = await axiosInstance.get(`/auth/get-profile/${userId}`);
      const user = response.data;
      
      set({
        isLoading: false,
        isError: false
      });
      
      return user;
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || 'Failed to fetch user profile';
      
      set({ 
        isError: true, 
        error: errorMessage, 
        isLoading: false 
      });
      
      toast.error(errorMessage);
      throw error;
    }
  }
}));