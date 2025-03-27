import {create} from 'zustand';
import { axiosInstance } from '@/lib/axios';



const useMentorStore = create((set, get) => ({
  requests: [],
  assignedStudents: [],
  isLoading: false,
  error: null,

  fetchRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/mentor/get-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Transform requests to include additional details
      const transformedRequests = response.data.requests.map((request) => ({
        ...request,
        requestDate: new Date().toLocaleDateString(), // You might want to get this from backend
        message: request.message || 'Mentorship Request'
      }));

      set({
        requests: transformedRequests,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch mentor requests',
        isLoading: false
      });
    }
  },

  fetchAssignedStudents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/mentor/get-student-assigned', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      set({
        assignedStudents: response.data.students,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch assigned students',
        isLoading: false
      });
    }
  },

  acceptMentorRequest: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/mentor/accept-request',
        { studentId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update local state
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.filter(request => request._id !== studentId);

      set({
        requests: updatedRequests,
        assignedStudents: [...get().assignedStudents, response.data.student],
        isLoading: false
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to accept mentor request',
        isLoading: false
      });
      throw error;
    }
  },

  declineMentorRequest: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      // If you have a specific decline endpoint, use it here
      // Otherwise, just remove from requests
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.filter(request => request._id !== studentId);

      set({
        requests: updatedRequests,
        isLoading: false
      });

      // Uncomment and modify if you have a backend endpoint for declining
      // await axiosInstance.post('/mentor/decline-request', 
      //   { studentId },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${localStorage.getItem('token')}`
      //     }
      //   }
      // );
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to decline mentor request',
        isLoading: false
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useMentorStore;