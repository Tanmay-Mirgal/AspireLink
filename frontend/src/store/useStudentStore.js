import { create } from "zustand"
import axios from "axios"
import { axiosInstance } from "@/lib/axios";

export const useStudentStore = create((set, get) => ({
  // Student data
  student: null,
  studentProfile: null,
  isLoading: false,
  error: null,
  
  // Mentor related data
  assignedMentors: [],
  unassignedMentors: [], // Add unassigned mentors state
  requestedMentors: [],
  
  // Skills data
  skillsData: [],
  industrySkillsData: [],
  skillsAnalytics: null,
  
  // Progress and other data
  progressData: null,
  jobEligibilityData: null,
  upcomingSessions: [],
  communityPosts: [],
  
  // Dashboard active tab state
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Action to fetch student profile
  fetchStudentProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First try to get user from localStorage
      const localUser = JSON.parse(localStorage.getItem("user"));
      
      if (localUser) {
        set({ 
          student: localUser,
          studentProfile: localUser.studentProfile || {},
          isLoading: false 
        });
        return localUser;
      }
      
      // If not in localStorage, fetch from API
      const response = await axios.get("/api/student/profile");
      
      set({ 
        student: response.data.student,
        studentProfile: response.data.student.studentProfile,
        isLoading: false 
      });
      
      // Save to localStorage for future use
      localStorage.setItem("user", JSON.stringify(response.data.student));
      
      return response.data.student;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch student profile", 
        isLoading: false 
      });
      console.error("Error fetching student profile:", error);
      return null;
    }
  },
  
  // Fetch assigned mentors using the mentorsAssigned controller
  fetchAssignedMentors: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/student/mentor-assigned");
      
      // Format mentors data for UI based on the actual response format
      const formattedMentors = response.data.mentors.map(mentor => ({
        id: mentor._id,
        name: mentor.fullName,
        expertise: mentor.companyName,
        skills: mentor.skills || [],
        experience: mentor.experience,
        profilePic: mentor.profilePic || `/placeholder.svg?height=96&width=96`,
        bio: mentor.bio,
        rating: calculateMentorRating(), // Mock rating function
        nextSession: "Not scheduled" // Default value
      }));
      
      set({ assignedMentors: formattedMentors, isLoading: false });
      return formattedMentors;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch assigned mentors", 
        isLoading: false 
      });
      console.error("Error fetching assigned mentors:", error);
      return [];
    }
  },
  
  // Fetch unassigned mentors
  fetchUnassignedMentors: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/student/get-unassigned-mentor");
      
      // Format unassigned mentors data for UI
      const formattedMentors = response.data.unassignedMentors.map(mentor => ({
        id: mentor._id,
        name: mentor.fullName,
        expertise: mentor.companyName,
        skills: mentor.skills || [],
        experience: mentor.experience,
        profilePic: mentor.profilePic || `/placeholder.svg?height=96&width=96`,
        bio: mentor.bio,
        rating: calculateMentorRating() // Mock rating function
      }));
      
      set({ unassignedMentors: formattedMentors, isLoading: false });
      return formattedMentors;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch unassigned mentors", 
        isLoading: false 
      });
      console.error("Error fetching unassigned mentors:", error);
      return [];
    }
  },
  
  // Send mentor request using the sendMentorRequest controller
  sendMentorRequest: async (mentorId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post("/student/add-mentor", { mentorId });
      
      // Update requested mentors list
      set(state => ({ 
        requestedMentors: [...state.requestedMentors, mentorId],
        isLoading: false 
      }));
      
      return { success: true, message: response.data.message };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to send mentor request", 
        isLoading: false 
      });
      console.error("Error sending mentor request:", error);
      return { success: false, message: error.response?.data?.message };
    }
  },
  
  // Fetch skills analytics using the getSkillsAnalytics controller
  fetchSkillsAnalytics: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/student/get-skills-analytics");
      
      set({ 
        skillsData: response.data.studentSkillsData,
        industrySkillsData: response.data.industrySkillsData,
        skillsAnalytics: response.data.analytics,
        isLoading: false 
      });
      
      return {
        skillsData: response.data.studentSkillsData,
        industrySkillsData: response.data.industrySkillsData,
        analytics: response.data.analytics
      };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Failed to fetch skills analytics", 
        isLoading: false 
      });
      console.error("Error fetching skills analytics:", error);
      return null;
    }
  },
  
  // Initialize dashboard with all required data
  initializeDashboard: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // First fetch student profile
      const studentData = await get().fetchStudentProfile();
      
      // Only fetch other data if we successfully got the student profile
      if (studentData) {
        // Fetch remaining data in parallel
        await Promise.all([
          get().fetchAssignedMentors(),
          get().fetchUnassignedMentors(), // Also fetch unassigned mentors
          get().fetchSkillsAnalytics()
        ]);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: "Failed to initialize dashboard", 
        isLoading: false 
      });
      console.error("Error initializing dashboard:", error);
    }
  }
}));

// Helper function to calculate mock mentor rating
function calculateMentorRating() {
  // Return a rating between 3.5 and 5.0
  return (Math.random() * 1.5 + 3.5).toFixed(1);
}