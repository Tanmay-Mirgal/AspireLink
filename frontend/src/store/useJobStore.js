import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

const useJobStore = create((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,

  // Fetch all jobs
  fetchAllJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/jobs/all-jobs');
      
      set({ 
        jobs: response.data.jobs, 
        isLoading: false 
      });
      return response.data.jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch jobs', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
      return null;
    }
  },

  // Fetch job by ID
  fetchJobById: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/jobs/get-job-by-id/${jobId}`);
      
      set({ 
        currentJob: response.data.job, 
        isLoading: false 
      });
      return response.data.job;
    } catch (error) {
      console.error('Error fetching job details:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch job details', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch job details');
      return null;
    }
  },

  // Apply for a job (assuming there's an API endpoint for this)
  applyForJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/jobs/apply/${jobId}`);
      
      // Update current job if it's loaded
      if (get().currentJob && get().currentJob._id === jobId) {
        set({ 
          currentJob: response.data.job,
          isLoading: false 
        });
      }
      
      toast.success('Successfully applied for job');
      return response.data.job;
    } catch (error) {
      console.error('Error applying for job:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to apply for job', 
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to apply for job');
      return null;
    }
  },

  // Clear current job from state
  clearCurrentJob: () => {
    set({ currentJob: null });
  }
}));

export default useJobStore;