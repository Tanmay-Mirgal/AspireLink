"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Trash2, Eye, Calendar, MessageCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import useMentorStore from "@/store/useMentorStore"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

// Define a clear interface for the student


export function StudentTable({ 
  title = "Assigned Students", 
  description = "List of students you are mentoring", 
  showAll = false, 
  buttonText = "View All" 
}) {
  const { assignedStudents, fetchAssignedStudents, isLoading } = useMentorStore();

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  const displayedStudents = showAll 
    ? assignedStudents 
    : assignedStudents.slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!showAll && (
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
            {isLoading ? (
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
                  <TableCell>{student.program || 'No Program'}</TableCell>
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

export function StudentsSection() {
  const { assignedStudents, fetchAssignedStudents, isLoading, removeStudent } = useMentorStore();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  useEffect(() => {
    fetchAssignedStudents();
  }, []);

  const handleAddStudent = () => {
    toast({
      title: "Add Student",
      description: "Student addition functionality coming soon!",
    });
  };

  const handleRemoveStudent = async () => {
    if (selectedStudent) {
      try {
        await removeStudent(selectedStudent.id);
        toast({
          title: "Student Removed",
          description: `${selectedStudent.name} has been removed from your assigned students.`,
        });
        setIsRemoveDialogOpen(false);
        setSelectedStudent(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove student. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const confirmRemoveStudent = (student) => {
    setSelectedStudent(student);
    setIsRemoveDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Students</CardTitle>
          <Button size="sm" onClick={handleAddStudent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Next Session</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : assignedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No assigned students
                  </TableCell>
                </TableRow>
              ) : (
                assignedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name || 'Unnamed Student'}
                    </TableCell>
                    <TableCell>{student.program || 'No Program'}</TableCell>
                    <TableCell>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${student.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {student.progress || 0}%
                      </span>
                    </TableCell>
                    <TableCell>{student.nextSession || 'TBD'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Session
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive" 
                            onSelect={() => confirmRemoveStudent(student)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog 
        open={isRemoveDialogOpen} 
        onOpenChange={() => setIsRemoveDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStudent?.name} from your assigned students?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveStudent}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}