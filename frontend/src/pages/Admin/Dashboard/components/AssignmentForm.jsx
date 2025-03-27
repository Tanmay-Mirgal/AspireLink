"use client"

import { useState, useEffect } from "react"
import { useAdminStore } from "@/store/useAdminStore"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Assuming you have toast notifications

export function AssignmentForm() {
  // Get data and functions directly from the store
  const { 
    students, 
    mentors, 
    assignMentor, 
    getAllStudents, 
    getAllMentors,
    isLoading
  } = useAdminStore()
  
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [searchStudents, setSearchStudents] = useState("")
  const [searchMentors, setSearchMentors] = useState("")

  // Fetch fresh data when component mounts
  useEffect(() => {
    getAllStudents()
    getAllMentors()
  }, [getAllStudents, getAllMentors])

  // Get only students without assigned mentors
  const availableStudents = Array.isArray(students) 
    ? students.filter(student => !student.assignedMentor)
    : []

  // Filter students based on search input
  const filteredStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
      student.email.toLowerCase().includes(searchStudents.toLowerCase()) ||
      (Array.isArray(student.skills) && student.skills.some(skill => 
        typeof skill === 'string' && skill.toLowerCase().includes(searchStudents.toLowerCase())
      ))
  )

  // Filter mentors based on search and selected student
  const matchedMentors = selectedStudent && Array.isArray(mentors)
    ? mentors.filter(mentor => 
        Array.isArray(mentor.skills) && Array.isArray(selectedStudent.skills) &&
        mentor.skills.some(mentorSkill => 
          selectedStudent.skills.includes(mentorSkill)
        )
      )
    : (Array.isArray(mentors) ? mentors : [])

  const filteredMentors = matchedMentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchMentors.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchMentors.toLowerCase()) ||
      (Array.isArray(mentor.skills) && mentor.skills.some(skill => 
        typeof skill === 'string' && skill.toLowerCase().includes(searchMentors.toLowerCase())
      ))
  )

  const handleAssignMentor = async () => {
    if (!selectedStudent || !selectedMentor) {
      toast.error("Please select both a student and a mentor")
      return
    }
    
    try {
      // Call the assignMentor function from your store
      const result = await assignMentor(selectedStudent.id, selectedMentor.id)
      
      if (result) {
        toast.success(`Successfully assigned ${selectedMentor.name} to ${selectedStudent.name}`)
        
        // Reset selections
        setSelectedStudent(null)
        setSelectedMentor(null)
        
        // Refresh data
        getAllStudents()
        getAllMentors()
      } else {
        toast.error("Failed to assign mentor")
      }
    } catch (error) {
      console.error("Error assigning mentor:", error)
      toast.error(error.message || "An error occurred while assigning mentor")
    }
  }
  
  const handleReset = () => {
    setSelectedStudent(null)
    setSelectedMentor(null)
    setSearchStudents("")
    setSearchMentors("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign Mentor to Student</CardTitle>
        <CardDescription>Match students with mentors based on skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Select Student</h3>
              <p className="text-sm text-muted-foreground">
                {availableStudents.length} students available for assignment
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search students..."
                  value={searchStudents}
                  onChange={(e) => setSearchStudents(e.target.value)}
                />
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow
                          key={student.id}
                          className={selectedStudent?.id === student.id ? "bg-muted/50" : ""}
                        >
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(student.skills) && student.skills.map((skill, index) => (
                                <Badge key={`${student.id}-skill-${index}`} variant="outline">
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          {searchStudents 
                            ? "No students match your search" 
                            : "No students available for assignment"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Select Mentor</h3>
              <p className="text-sm text-muted-foreground">
                {selectedStudent 
                  ? `${matchedMentors.length} mentors match with ${selectedStudent.name}'s skills` 
                  : "Please select a student first"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search mentors..."
                  value={searchMentors}
                  onChange={(e) => setSearchMentors(e.target.value)}
                  disabled={!selectedStudent}
                />
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!selectedStudent ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          Please select a student first
                        </TableCell>
                      </TableRow>
                    ) : filteredMentors.length > 0 ? (
                      filteredMentors.map((mentor) => (
                        <TableRow
                          key={mentor.id}
                          className={selectedMentor?.id === mentor.id ? "bg-muted/50" : ""}
                        >
                          <TableCell className="font-medium">{mentor.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(mentor.skills) && mentor.skills.map((skill, index) => {
                                // Check if this skill matches any of the selected student's skills
                                const isMatchingSkill = selectedStudent && 
                                  Array.isArray(selectedStudent.skills) && 
                                  selectedStudent.skills.includes(skill);
                                
                                return (
                                  <Badge 
                                    key={`${mentor.id}-skill-${index}`} 
                                    variant="outline"
                                    className={isMatchingSkill ? "bg-green-50 text-green-700 border-green-200" : ""}
                                  >
                                    {skill}
                                  </Badge>
                                );
                              })}
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          {searchMentors 
                            ? "No mentors match your search" 
                            : "No matching mentors found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          onClick={handleAssignMentor} 
          disabled={!selectedStudent || !selectedMentor || isLoading}
        >
          {isLoading ? "Assigning..." : "Assign Mentor"}
        </Button>
      </CardFooter>
    </Card>
  )
}