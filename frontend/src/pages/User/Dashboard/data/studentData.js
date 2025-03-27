import {
    Award,
    BookOpen,
    CheckCircle,
    Users,
  } from "lucide-react"
  
  export const studentProfile = {
    name: "Emily Johnson",
    program: "Web Development",
    email: "emily.johnson@example.com",
    joinDate: "January 15, 2023",
    completionPercentage: 85,
    badges: [
      { name: "Profile Complete", icon: CheckCircle, color: "bg-green-500" },
      { name: "Fast Learner", icon: BookOpen, color: "bg-blue-500" },
      { name: "Team Player", icon: Users, color: "bg-purple-500" },
    ],
  }
  
  export const assignedMentors = [
    { id: 1, name: "David Wilson", expertise: "Frontend Development", rating: 4.9, nextSession: "Today, 4:00 PM" },
    { id: 2, name: "Sarah Chen", expertise: "UI/UX Design", rating: 4.8, nextSession: "Jul 18, 2:00 PM" },
    { id: 3, name: "Michael Rodriguez", expertise: "Backend Development", rating: 4.7, nextSession: "Jul 20, 11:00 AM" },
  ]
  
  export const skillsData = [
    { subject: "HTML/CSS", A: 90, fullMark: 100 },
    { subject: "JavaScript", A: 75, fullMark: 100 },
    { subject: "React", A: 65, fullMark: 100 },
    { subject: "Node.js", A: 60, fullMark: 100 },
    { subject: "UI/UX", A: 80, fullMark: 100 },
    { subject: "Git", A: 70, fullMark: 100 },
  ]
  
  export const industrySkillsData = [
    { subject: "HTML/CSS", A: 85, fullMark: 100 },
    { subject: "JavaScript", A: 90, fullMark: 100 },
    { subject: "React", A: 85, fullMark: 100 },
    { subject: "Node.js", A: 80, fullMark: 100 },
    { subject: "UI/UX", A: 75, fullMark: 100 },
    { subject: "Git", A: 80, fullMark: 100 },
  ]
  
  export const jobEligibilityData = [
    { name: "Frontend Developer", score: 85 },
    { name: "UI Designer", score: 70 },
    { name: "Full Stack Developer", score: 65 },
    { name: "Web Developer", score: 80 },
    { name: "React Developer", score: 75 },
    { name: "UX Researcher", score: 60 },
  ]
  
  export const progressData = [
    { module: "HTML Fundamentals", completed: true, score: 95 },
    { module: "CSS Layouts", completed: true, score: 88 },
    { module: "JavaScript Basics", completed: true, score: 92 },
    { module: "DOM Manipulation", completed: true, score: 85 },
    { module: "React Components", completed: true, score: 78 },
    { module: "React Hooks", completed: false, progress: 60 },
    { module: "State Management", completed: false, progress: 30 },
    { module: "API Integration", completed: false, progress: 10 },
  ]
  
  export const upcomingSessions = [
    {
      id: 1,
      title: "React Components Deep Dive",
      mentor: "David Wilson",
      date: "Today, 4:00 PM",
      duration: "45 minutes",
    },
    { 
      id: 2, 
      title: "UI Design Principles", 
      mentor: "Sarah Chen", 
      date: "Jul 18, 2:00 PM", 
      duration: "60 minutes" 
    },
    {
      id: 3,
      title: "Backend Integration",
      mentor: "Michael Rodriguez",
      date: "Jul 20, 11:00 AM",
      duration: "45 minutes",
    },
  ]
  
  export const communityPosts = [
    { id: 1, author: "Alex Smith", title: "How I landed my first dev job", likes: 24, comments: 8, date: "2 days ago" },
    { id: 2, author: "Maria Garcia", title: "Resources for learning React", likes: 45, comments: 12, date: "3 days ago" },
    { id: 3, author: "John Doe", title: "My journey from beginner to pro", likes: 67, comments: 15, date: "1 week ago" },
  ]