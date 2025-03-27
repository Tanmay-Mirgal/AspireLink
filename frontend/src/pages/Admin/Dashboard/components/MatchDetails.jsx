"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MatchDetails({ selectedStudent, selectedMentor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Details</CardTitle>
        <CardDescription>Review the selected student and mentor match</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedStudent && selectedMentor ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
                      {Array.isArray(selectedStudent.skills) && selectedStudent.skills.map((skill, index) => (
                        <Badge key={`student-skill-${index}`} variant="outline">
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
                      {Array.isArray(selectedMentor.skills) && selectedMentor.skills.map((skill, index) => {
                        // Check if this skill matches any of the student's skills
                        const isMatchingSkill = Array.isArray(selectedStudent.skills) && 
                          selectedStudent.skills.includes(skill);
                        
                        return (
                          <Badge 
                            key={`mentor-skill-${index}`} 
                            variant="outline"
                            className={isMatchingSkill ? "bg-green-50 text-green-700 border-green-200" : ""}
                          >
                            {skill}
                          </Badge>
                        );
                      })}
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
  )
}