// src/store/postStore.js
import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0
  },
  currentPost: null,

  // Get all posts with pagination
  fetchPosts: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/posts/all-posts`, {
        withCredentials: true
      });
      
      set({ 
        posts: response.data.posts, 
        pagination: response.data.pagination,
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch posts', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
      return null;
    }
  },

  // Get a single post by ID
  fetchPostById: async (postId) => {
    set({ isLoading: true, error: null, currentPost: null });
    try {
      const response = await axiosInstance.get(`/posts/${postId}`, {
        withCredentials: true
      });
      
      set({ currentPost: response.data.post, isLoading: false });
      return response.data.post;
    } catch (error) {
      console.error('Error fetching post:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch post', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch post');
      return null;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      
      if (postData.title) formData.append('title', postData.title);
      if (postData.content) formData.append('content', postData.content);
      if (postData.image) formData.append('image', postData.image);
      
      const response = await axiosInstance.post('/posts/create-post', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update posts list with new post at the beginning
      set(state => ({ 
        posts: [response.data.post, ...state.posts],
        isLoading: false 
      }));
      
      toast.success('Post created successfully');
      return response.data.post;
    } catch (error) {
      console.error('Error creating post:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to create post', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to create post');
      return null;
    }
  },

  // Update a post
  updatePost: async (postId, postData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      
      if (postData.title) formData.append('title', postData.title);
      if (postData.content) formData.append('content', postData.content);
      if (postData.image) formData.append('image', postData.image);
      
      const response = await axiosInstance.put(`/posts/update/${postId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update the post in the posts array
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId ? response.data.post : post
        ),
        isLoading: false
      }));
      
      if (get().currentPost && get().currentPost._id === postId) {
        set({ currentPost: response.data.post });
      }
      
      toast.success('Post updated successfully');
      return response.data.post;
    } catch (error) {
      console.error('Error updating post:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update post', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to update post');
      return null;
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/posts/delete/${postId}`);
      
      // Remove the deleted post from the posts array
      set(state => ({
        posts: state.posts.filter(post => post._id !== postId),
        isLoading: false
      }));
      
      toast.success('Post deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete post', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to delete post');
      return false;
    }
  },

  // Like or unlike a post
  likePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/like/${postId}`, {}, {
        withCredentials: true
      });
      
      // Update the post in the posts array
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId ? response.data.post : post
        )
      }));
      
      if (get().currentPost && get().currentPost._id === postId) {
        set({ currentPost: response.data.post });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast.error(error.response?.data?.message || 'Failed to like/unlike post');
      return null;
    }
  },

  // Add a comment to a post
  addComment: async (postId, content) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, { content }, {
        withCredentials: true
      });
      
      // Update the post in the posts array
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId ? response.data.post : post
        )
      }));
      
      if (get().currentPost && get().currentPost._id === postId) {
        set({ currentPost: response.data.post });
      }
      
      toast.success('Comment added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
      return null;
    }
  },

  // Delete a comment
  deleteComment: async (postId, commentId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}/comment/${commentId}`, {
        withCredentials: true
      });
      
      // Update the post in the posts array
      set(state => ({
        posts: state.posts.map(post => 
          post._id === postId ? response.data.post : post
        )
      }));
      
      if (get().currentPost && get().currentPost._id === postId) {
        set({ currentPost: response.data.post });
      }
      
      toast.success('Comment deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
      return null;
    }
  },

  // Reset current post
  resetCurrentPost: () => set({ currentPost: null }),

  // Reset error
  resetError: () => set({ error: null })
}));

export default usePostStore;