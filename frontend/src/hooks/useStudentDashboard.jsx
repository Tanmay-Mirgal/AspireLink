import { useEffect } from 'react'
import { useStudentStore } from './student-store'

export function useStudentDashboard() {
  const {
    // State
    student,
    studentProfile,
    assignedMentors,
    skillsData,
    industrySkillsData,
    skillsAnalytics,
    progressData,
    jobEligibilityData,
    upcomingSessions,
    communityPosts,
    isLoading,
    error,
    activeTab,
    
    // Actions
    setActiveTab,
    fetchAssignedMentors,
    sendMentorRequest,
    initializeDashboard
  } = useStudentStore()

  // Initialize dashboard on component mount
  useEffect(() => {
    initializeDashboard()
  }, [initializeDashboard])

  return {
    // State
    student,
    studentProfile,
    assignedMentors,
    skillsData,
    industrySkillsData,
    skillsAnalytics,
    progressData,
    jobEligibilityData,
    upcomingSessions,
    communityPosts,
    isLoading,
    error,
    activeTab,
    
    // Actions
    setActiveTab,
    fetchAssignedMentors,
    sendMentorRequest
  }
}