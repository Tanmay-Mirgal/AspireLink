import {create} from 'zustand'
import { axiosInstance } from '@/lib/axios'

// Internal helper functions for data formatting
const formatStudentData = (student) => ({
  id: student._id,
  name: `${student.fullName?.firstName || ''} ${student.fullName?.lastName || ''}`.trim(),
  email: student.email,
  skills: Array.isArray(student.studentProfile?.skills) 
    ? student.studentProfile.skills.map(skill => 
        typeof skill === 'string' ? skill : (skill?.name || 'Skill'))
    : [],
  status: student.studentProfile?.assignedMentor ? "Assigned" : "Active",
  assignedMentor: student.studentProfile?.assignedMentor || null
})

const formatMentorData = (mentor) => ({
  id: mentor._id,
  name: `${mentor.fullName?.firstName || ''} ${mentor.fullName?.lastName || ''}`.trim(),
  email: mentor.email,
  skills: Array.isArray(mentor.mentorSchema?.[0]?.skills) 
    ? mentor.mentorSchema[0].skills.map(skill => 
        typeof skill === 'string' ? skill : (skill?.name || 'Skill'))
    : [],
  students: mentor.mentorSchema?.[0]?.studentAssigned?.length || 0,
  status: "Active"
})

const formatRegistrationData = (registration) => ({
  id: registration._id,
  name: `${registration.fullName?.firstName || ''} ${registration.fullName?.lastName || ''}`.trim(),
  email: registration.email,
  type: registration.role === 'student' ? 'Student' : 'Mentor',
  skills: Array.isArray(registration.studentProfile?.skills) 
    ? registration.studentProfile.skills.map(skill => 
        typeof skill === 'string' ? skill : (skill?.name || 'Skill'))
    : [],
  date: new Date(registration.createdAt || Date.now()).toISOString().split('T')[0]
})

export const useAdminStore = create((set, get) => ({
    // Admin data
    admin: null,
    setAdmin: (admin) => set({ admin }),
    
    // Loading and error states
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
    error: null,
    setError: (error) => set({ error }),
    
    // Data collections - formatted data
    students: [],
    mentors: [],
    pendingRegistrations: [],
    approvedRegistrations: [],
    
    // Raw data (if needed)
    rawStudents: [],
    rawMentors: [],
    rawPendingRegistrations: [],
    rawApprovedRegistrations: [],
    
    // API Functions
    getAllMentors: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.get('/admin/get-all-mentors')
        
        // Format data before storing it
        const formattedMentors = Array.isArray(response.data) 
          ? response.data.map(mentor => formatMentorData(mentor))
          : []
        
        set({ 
          mentors: formattedMentors,
          rawMentors: response.data,
          isLoading: false 
        })
        return formattedMentors
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch mentors', 
          isLoading: false 
        })
        console.error('Get all mentors error:', error)
        return []
      }
    },
    
    getAllStudents: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.get('/admin/get-all-students')
        
        // Format data before storing it
        const formattedStudents = Array.isArray(response.data) 
          ? response.data.map(student => formatStudentData(student))
          : []
        
        set({ 
          students: formattedStudents,
          rawStudents: response.data,
          isLoading: false 
        })
        return formattedStudents
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch students', 
          isLoading: false 
        })
        console.error('Get all students error:', error)
        return []
      }
    },
    
    getPendingRegistrations: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.get('/admin/get-registration')
        
        // Format data before storing it
        const formattedRegistrations = Array.isArray(response.data) 
          ? response.data.map(reg => formatRegistrationData(reg))
          : []
        
        set({ 
          pendingRegistrations: formattedRegistrations,
          rawPendingRegistrations: response.data,
          isLoading: false 
        })
        return formattedRegistrations
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch pending registrations', 
          isLoading: false 
        })
        console.error('Get pending registrations error:', error)
        return []
      }
    },
    
    getApprovedRegistrations: async () => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.get('/admin/approved-students')
        
        // Format data before storing it
        const formattedRegistrations = Array.isArray(response.data) 
          ? response.data.map(reg => formatRegistrationData(reg))
          : []
        
        set({ 
          approvedRegistrations: formattedRegistrations,
          rawApprovedRegistrations: response.data,
          isLoading: false 
        })
        return formattedRegistrations
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch approved registrations', 
          isLoading: false 
        })
        console.error('Get approved registrations error:', error)
        return []
      }
    },
    
    updateRegistration: async (id) => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.post(`/admin/update-registration/${id}`)
        
        // Update the pending and approved registrations
        await get().getPendingRegistrations()
        await get().getApprovedRegistrations()
        
        set({ isLoading: false })
        return response.data
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to update registration', 
          isLoading: false 
        })
        console.error('Update registration error:', error)
        return null
      }
    },
    
    assignMentor: async (studentId, mentorId) => {
      try {
        set({ isLoading: true, error: null })
        const response = await axiosInstance.post('/admin/assign-mentor', { 
          studentId, 
          mentorId 
        })
        
        // Refresh students and mentors data
        await get().getAllStudents()
        await get().getAllMentors()
        
        set({ isLoading: false })
        return response.data
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to assign mentor', 
          isLoading: false 
        })
        console.error('Assign mentor error:', error)
        return null
      }
    },
    
    // Get available students (not assigned to a mentor)
    getAvailableStudents: () => {
      const { students } = get()
      return students.filter(student => !student.assignedMentor)
    },
    
    // Get matching mentors for a given student based on skills
    getMatchingMentors: (studentId) => {
      const { students, mentors } = get()
      const student = students.find(s => s.id === studentId)
      
      if (!student) return []
      
      return mentors.filter(mentor => 
        mentor.skills.some(mentorSkill => 
          student.skills.includes(mentorSkill)
        )
      )
    },
    
    // Function to fetch all data
    fetchAllData: async () => {
      set({ isLoading: true, error: null })
      try {
        await Promise.all([
          get().getAllStudents(),
          get().getAllMentors(),
          get().getPendingRegistrations(),
          get().getApprovedRegistrations()
        ])
        set({ isLoading: false })
      } catch (error) {
        set({ 
          error: 'Failed to fetch data',
          isLoading: false 
        })
        console.error('Fetch all data error:', error)
      }
    },
    
    // Reset error state
    clearError: () => set({ error: null })
  }))