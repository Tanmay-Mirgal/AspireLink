import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';


const useProjectStore = create((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get('/projects/get-all-projects');
      const data = response.data;
      set({ projects: data.projects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  fetchProjectById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/projects/${id}`);
      const data = response.data;
      set({ selectedProject: data.project, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch project details', isLoading: false });
    }
  },

  createProject: async (projectData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post('/projects/create-project', projectData);
      const data = response.data;
      set((state) => ({
        projects: [...state.projects, data.project],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create project', isLoading: false });
    }
  },
}));

export default useProjectStore;
