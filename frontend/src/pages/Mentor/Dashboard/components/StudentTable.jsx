"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"
import { useState, useEffect } from "react"
import useMentorStore from "@/store/useMentorStore"

export function StudentTable({ 
  title = "Assigned Students", 
  description = "List of students you are mentoring", 
  showAll = false, 
  buttonText = "View All",
  students = null // Optional prop to directly pass students
}) {
  const { assignedStudents, fetchAssignedStudents, isLoading } = useMentorStore();
  
  // Use students from props if provided, otherwise use students from store
  const [displayStudents, setDisplayStudents] = useState([]);
  
  useEffect(() => {
    if (!students) {
      fetchAssignedStudents();
    }
  }, [fetchAssignedStudents, students]);
  
  useEffect(() => {
    if (students) {
      setDisplayStudents(students);
    } else {
      setDisplayStudents(assignedStudents);
    }
  }, [students, assignedStudents]);

  // If not showing all, limit to 3 students
  const displayedStudents = showAll 
    ? displayStudents 
    : displayStudents.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!showAll && displayStudents.length > 3 && (
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Next Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !students ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : displayedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No assigned students
                </TableCell>
              </TableRow>
            ) : (
              displayedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.name || 'Unnamed Student'}
                  </TableCell>
                  <TableCell>{typeof student.program === 'object' 
                      ? (student.program.name || JSON.stringify(student.program)) 
                      : (student.program || 'No Program')}</TableCell>
                  <TableCell>{student.nextSession || 'TBD'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Example of how to use the component with directly passed students:
/*
export function StudentDashboard() {
  const sampleStudents = [
    { id: 1, name: "John Doe", program: "Web Development", nextSession: "Tomorrow, 3PM" },
    { id: 2, name: "Jane Smith", program: "Data Science", nextSession: "Friday, 2PM" },
    { id: 3, name: "Sam Johnson", program: "UI/UX Design", nextSession: "Monday, 10AM" },
  ];

  return (
    <div>
      <StudentTable 
        title="My Students" 
        description="Students currently assigned to you" 
        students={sampleStudents} 
      />
    </div>
  )
}
*/