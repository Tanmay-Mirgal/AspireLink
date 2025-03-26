"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, UserCheck, Clock, Search, UserPlus, CheckCircle, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Sample data for charts and tables
const chartData = [
  { name: "Jan", students: 40, mentors: 24, connections: 18 },
  { name: "Feb", students: 30, mentors: 28, connections: 22 },
  { name: "Mar", students: 60, mentors: 32, connections: 30 },
  { name: "Apr", students: 50, mentors: 35, connections: 25 },
  { name: "May", students: 70, mentors: 40, connections: 35 },
  { name: "Jun", students: 85, mentors: 45, connections: 40 },
]

const students = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    skills: ["Python", "Data Science", "Machine Learning"],
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    skills: ["Java", "Spring", "Hibernate"],
    status: "Active",
  },
  { id: 4, name: "Emily Davis", email: "emily@example.com", skills: ["UX/UI", "Figma", "Adobe XD"], status: "Active" },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    skills: ["C++", "Algorithms", "Data Structures"],
    status: "Active",
  },
]

const mentors = [
  {
    id: 1,
    name: "Dr. Robert Chen",
    email: "robert@example.com",
    skills: ["JavaScript", "React", "Node.js"],
    students: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Prof. Lisa Taylor",
    email: "lisa@example.com",
    skills: ["Python", "Data Science", "Machine Learning"],
    students: 5,
    status: "Active",
  },
  {
    id: 3,
    name: "James Anderson",
    email: "james@example.com",
    skills: ["Java", "Spring", "Hibernate"],
    students: 2,
    status: "Active",
  },
  {
    id: 4,
    name: "Dr. Sophia Martinez",
    email: "sophia@example.com",
    skills: ["UX/UI", "Figma", "Adobe XD"],
    students: 4,
    status: "Active",
  },
  {
    id: 5,
    name: "Prof. Thomas Clark",
    email: "thomas@example.com",
    skills: ["C++", "Algorithms", "Data Structures"],
    students: 3,
    status: "Active",
  },
]

const pendingRegistrations = [
  {
    id: 1,
    name: "Kevin Lee",
    email: "kevin@example.com",
    type: "Student",
    skills: ["Python", "Django", "Flask"],
    date: "2025-03-25",
  },
  {
    id: 2,
    name: "Rachel Green",
    email: "rachel@example.com",
    type: "Mentor",
    skills: ["JavaScript", "Vue.js", "Express"],
    date: "2025-03-26",
  },
  {
    id: 3,
    name: "Daniel Smith",
    email: "daniel@example.com",
    type: "Student",
    skills: ["Ruby", "Rails", "PostgreSQL"],
    date: "2025-03-26",
  },
]

const approvedRegistrations = [
  {
    id: 1,
    name: "Olivia Johnson",
    email: "olivia@example.com",
    type: "Student",
    skills: ["HTML", "CSS", "JavaScript"],
    date: "2025-03-20",
  },
  {
    id: 2,
    name: "William Brown",
    email: "william@example.com",
    type: "Mentor",
    skills: ["React", "Redux", "TypeScript"],
    date: "2025-03-21",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    type: "Student",
    skills: ["PHP", "Laravel", "MySQL"],
    date: "2025-03-22",
  },
  {
    id: 4,
    name: "Noah Wilson",
    email: "noah@example.com",
    type: "Mentor",
    skills: ["Python", "TensorFlow", "Keras"],
    date: "2025-03-23",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [searchStudents, setSearchStudents] = useState("")
  const [searchMentors, setSearchMentors] = useState("")

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
      student.email.toLowerCase().includes(searchStudents.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchStudents.toLowerCase())),
  )

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchMentors.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchMentors.toLowerCase()) ||
      mentor.skills.some((skill) => skill.toLowerCase().includes(searchMentors.toLowerCase())),
  )

  const matchedMentors = selectedStudent
    ? mentors.filter((mentor) => mentor.skills.some((skill) => selectedStudent.skills.includes(skill)))
    : []

  const matchedStudents = selectedMentor
    ? students.filter((student) => student.skills.some((skill) => selectedMentor.skills.includes(skill)))
    : []

  const handleAssignMentor = () => {
    if (selectedStudent && selectedMentor) {
      alert(`Assigned mentor ${selectedMentor.name} to student ${selectedStudent.name}`)
      // In a real app, you would make an API call here
      setSelectedStudent(null)
      setSelectedMentor(null)
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary p-1">
                <UserCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold">MentorConnect</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("dashboard")} isActive={activeTab === "dashboard"}>
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("students")} isActive={activeTab === "students"}>
                  <Users className="h-4 w-4" />
                  <span>Students</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("mentors")} isActive={activeTab === "mentors"}>
                  <UserCheck className="h-4 w-4" />
                  <span>Mentors</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("pending")} isActive={activeTab === "pending"}>
                  <Clock className="h-4 w-4" />
                  <span>Pending Registrations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("approved")} isActive={activeTab === "approved"}>
                  <CheckCircle className="h-4 w-4" />
                  <span>Approved Registrations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab("assign")} isActive={activeTab === "assign"}>
                  <UserPlus className="h-4 w-4" />
                  <span>Assign Mentor</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-medium">A</span>
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@mentorconnect.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "students" && "Students"}
                {activeTab === "mentors" && "Mentors"}
                {activeTab === "pending" && "Pending Registrations"}
                {activeTab === "approved" && "Approved Registrations"}
                {activeTab === "assign" && "Assign Mentor"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Notifications</span>
              </Button>
            </div>
          </header>
          <main className="grid gap-6 p-6">
            {activeTab === "dashboard" && (
              <>
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{students.length}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mentors.length}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{pendingRegistrations.length}</div>
                      <p className="text-xs text-muted-foreground">+2 new since yesterday</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Network Growth</CardTitle>
                    <CardDescription>Monthly growth of students, mentors, and connections</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="students" fill="#8884d8" name="Students" />
                          <Bar dataKey="mentors" fill="#82ca9d" name="Mentors" />
                          <Bar dataKey="connections" fill="#ffc658" name="Connections" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Students</CardTitle>
                      <CardDescription>Latest student registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Skills</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.slice(0, 3).map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {student.skills.map((skill) => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Mentors</CardTitle>
                      <CardDescription>Latest mentor registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Skills</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mentors.slice(0, 3).map((mentor) => (
                            <TableRow key={mentor.id}>
                              <TableCell className="font-medium">{mentor.name}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {mentor.skills.map((skill) => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "students" && (
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>Manage all registered students</CardDescription>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                      placeholder="Search students..."
                      value={searchStudents}
                      onChange={(e) => setSearchStudents(e.target.value)}
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "mentors" && (
              <Card>
                <CardHeader>
                  <CardTitle>Mentors</CardTitle>
                  <CardDescription>Manage all registered mentors</CardDescription>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input
                      placeholder="Search mentors..."
                      value={searchMentors}
                      onChange={(e) => setSearchMentors(e.target.value)}
                    />
                    <Button type="submit" size="sm" variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMentors.map((mentor) => (
                        <TableRow key={mentor.id}>
                          <TableCell>{mentor.id}</TableCell>
                          <TableCell className="font-medium">{mentor.name}</TableCell>
                          <TableCell>{mentor.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {mentor.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{mentor.students}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {mentor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Registrations</CardTitle>
                  <CardDescription>Review and approve new registration requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.id}</TableCell>
                          <TableCell className="font-medium">{registration.name}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.type}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {registration.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{registration.date}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-green-500 text-green-500 hover:bg-green-50"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "approved" && (
              <Card>
                <CardHeader>
                  <CardTitle>Approved Registrations</CardTitle>
                  <CardDescription>Recently approved registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.id}</TableCell>
                          <TableCell className="font-medium">{registration.name}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.type}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {registration.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{registration.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "assign" && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assign Mentor to Student</CardTitle>
                    <CardDescription>Match students with mentors based on skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Select Student</h3>
                          <p className="text-sm text-muted-foreground">Choose a student to assign a mentor</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex w-full items-center space-x-2">
                            <Input
                              placeholder="Search students..."
                              value={searchStudents}
                              onChange={(e) => setSearchStudents(e.target.value)}
                            />
                          </div>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Skills</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredStudents.map((student) => (
                                  <TableRow
                                    key={student.id}
                                    className={selectedStudent?.id === student.id ? "bg-muted/50" : ""}
                                  >
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {student.skills.map((skill) => (
                                          <Badge key={skill} variant="outline">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant={selectedStudent?.id === student.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedStudent(student)}
                                      >
                                        {selectedStudent?.id === student.id ? "Selected" : "Select"}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Select Mentor</h3>
                          <p className="text-sm text-muted-foreground">Choose a mentor with matching skills</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex w-full items-center space-x-2">
                            <Input
                              placeholder="Search mentors..."
                              value={searchMentors}
                              onChange={(e) => setSearchMentors(e.target.value)}
                            />
                          </div>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Skills</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(selectedStudent ? matchedMentors : filteredMentors).map((mentor) => (
                                  <TableRow
                                    key={mentor.id}
                                    className={selectedMentor?.id === mentor.id ? "bg-muted/50" : ""}
                                  >
                                    <TableCell className="font-medium">{mentor.name}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                {mentor.skills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className={
                                      selectedStudent?.skills.includes(skill)
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : ""
                                    }
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        variant={selectedMentor?.id === mentor.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedMentor(mentor)}
                                      >
                                        {selectedMentor?.id === mentor.id ? "Selected" : "Select"}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedStudent(null)
                        setSelectedMentor(null)
                      }}
                    >
                      Reset
                    </Button>
                    <Button onClick={handleAssignMentor} disabled={!selectedStudent || !selectedMentor}>
                      Assign Mentor
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment Details</CardTitle>
                    <CardDescription>Review the selected student and mentor match</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent && selectedMentor ? (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <h3 className="font-medium">Student Information</h3>
                          <div className="rounded-md border p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="text-sm">{selectedStudent.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Email:</span>
                                <span className="text-sm">{selectedStudent.email}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Skills:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {selectedStudent.skills.map((skill) => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-medium">Mentor Information</h3>
                          <div className="rounded-md border p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="text-sm">{selectedMentor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Email:</span>
                                <span className="text-sm">{selectedMentor.email}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Skills:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {selectedMentor.skills.map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className={
                                        selectedStudent.skills.includes(skill)
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : ""
                                      }
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                        <div className="text-center">
                          <h3 className="text-lg font-medium">No Selection</h3>
                          <p className="text-sm text-muted-foreground">
                            Please select both a student and a mentor to see matching details
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Missing Bell icon component
function Bell(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

