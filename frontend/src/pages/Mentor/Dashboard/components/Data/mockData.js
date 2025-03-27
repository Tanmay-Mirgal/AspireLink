"use client"

import { Users, Clock, CheckCircle } from "lucide-react"

// Mock data for the dashboard stats
export const statsData = [
  { title: "Total Students", value: "24", icon: Users, change: "+12%", changeType: "positive" },
  { title: "Pending Requests", value: "8", icon: Clock, change: "-2%", changeType: "negative" },
  { title: "Completed Sessions", value: "156", icon: CheckCircle, change: "+8%", changeType: "positive" },
]

// Mock data for the activity chart
export const chartData = [
  { name: "Jan", sessions: 12, requests: 18 },
  { name: "Feb", sessions: 18, requests: 22 },
  { name: "Mar", sessions: 15, requests: 19 },
  { name: "Apr", sessions: 25, requests: 28 },
  { name: "May", sessions: 30, requests: 35 },
  { name: "Jun", sessions: 27, requests: 32 },
]

// Mock data for assigned students
export const assignedStudents = [
  { id: 1, name: "Alex Johnson", program: "Web Development", progress: 75, nextSession: "Today, 3:00 PM" },
  { id: 2, name: "Maria Garcia", program: "Data Science", progress: 60, nextSession: "Tomorrow, 2:00 PM" },
  { id: 3, name: "James Wilson", program: "UX Design", progress: 45, nextSession: "Jul 15, 4:30 PM" },
  { id: 4, name: "Sarah Lee", program: "Mobile Development", progress: 90, nextSession: "Jul 18, 1:00 PM" },
  { id: 5, name: "David Chen", program: "Cybersecurity", progress: 30, nextSession: "Jul 20, 11:00 AM" },
]

// Mock data for pending requests
export const pendingRequests = [
  {
    id: 1,
    name: "Emma Davis",
    program: "Web Development",
    requestDate: "Jul 12, 2023",
    message: "Need guidance on React hooks",
  },
  {
    id: 2,
    name: "Michael Brown",
    program: "Data Science",
    requestDate: "Jul 13, 2023",
    message: "Looking for help with Python data visualization",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    program: "UX Design",
    requestDate: "Jul 14, 2023",
    message: "Would like feedback on my portfolio",
  },
]

// Mock data for pending assessments
export const pendingAssessments = [
  { id: 1, name: "Ryan Taylor", program: "Web Development", dueDate: "Jul 15, 2023", type: "Mock Interview" },
  { id: 2, name: "Olivia Wilson", program: "Mobile Development", dueDate: "Jul 16, 2023", type: "Code Review" },
  { id: 3, name: "Daniel Kim", program: "Cybersecurity", dueDate: "Jul 18, 2023", type: "Project Assessment" },
]