"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AssignmentForm({ students, mentors }) {
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

  // Match mentors based on skills
  const matchedMentors = selectedStudent
    ? mentors.filter((mentor) => mentor.skills.some((skill) => selectedStudent.skills.includes(skill)))
    : []

  const handleAssignMentor = () => {
    if (selectedStudent && selectedMentor) {
      alert(`Assigned mentor ${selectedMentor.name} to student ${selectedStudent.name}`)
      // In a real app, you would make an API call here
      setSelectedStudent(null)
      setSelectedMentor(null)
    }
  }
  
  const handleReset = () => {
    setSelectedStudent(null)
    setSelectedMentor(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Mentor to Student</CardTitle>
        <CardDescription>Match students with mentors based on skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
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
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleAssignMentor} disabled={!selectedStudent || !selectedMentor}>
          Assign Mentor
        </Button>
      </CardFooter>
    </Card>
  )
}