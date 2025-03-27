/**
 * Formats student data from API for consistent display in the UI
 */
const formatStudentData = (student) => {
  return {
    id: student._id,
    name: `${student.fullName?.firstName || ''} ${student.fullName?.lastName || ''}`.trim(),
    email: student.email,
    skills: Array.isArray(student.studentProfile?.skills) 
      ? student.studentProfile.skills 
      : [],
    status: student.studentProfile?.assignedMentor ? "Assigned" : "Active",
    assignedMentor: student.studentProfile?.assignedMentor || null
  }
}

/**
 * Formats mentor data from API for consistent display in the UI
 */
 const formatMentorData = (mentor) => {
  return {
    id: mentor._id,
    name: `${mentor.fullName?.firstName || ''} ${mentor.fullName?.lastName || ''}`.trim(),
    email: mentor.email,
    skills: Array.isArray(mentor.mentorSchema?.[0]?.skills) 
      ? mentor.mentorSchema[0].skills 
      : [],
    students: mentor.mentorSchema?.[0]?.studentAssigned?.length || 0,
    status: "Active"
  }
}

/**
 * Formats registration data from API for consistent display in the UI
 */
 const formatRegistrationData = (registration) => {
  return {
    id: registration._id,
    name: `${registration.fullName?.firstName || ''} ${registration.fullName?.lastName || ''}`.trim(),
    email: registration.email,
    type: registration.role === 'student' ? 'Student' : 'Mentor',
    skills: Array.isArray(registration.studentProfile?.skills) 
      ? registration.studentProfile.skills 
      : [],
    date: new Date(registration.createdAt || Date.now()).toISOString().split('T')[0]
  }
}

export default {
  formatStudentData,
  formatMentorData,
  formatRegistrationData
}