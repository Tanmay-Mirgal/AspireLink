"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MatchDetails({ selectedStudent, selectedMentor }) {
  // Helper function to extract skill names consistently
  const getSkillNames = (skillsArray) => {
    if (!Array.isArray(skillsArray)) return [];
    
    return skillsArray.map(skill => {
      if (typeof skill === 'string') return skill;
      if (skill && typeof skill === 'object' && skill.name) return skill.name;
      return '';
    }).filter(name => name !== '');
  }

  // Check if both student and mentor are selected
  const isReady = selectedStudent && selectedMentor;

  // Get skill names for matching
  const studentSkills = selectedStudent ? getSkillNames(selectedStudent.skills) : [];
  const mentorSkills = selectedMentor ? getSkillNames(selectedMentor.skills) : [];

  // Find matching skills
  const matchingSkills = studentSkills.filter(skill => 
    mentorSkills.includes(skill)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Details</CardTitle>
        <CardDescription>
          {isReady 
            ? `Reviewing match between ${selectedStudent.name} and ${selectedMentor.name}` 
            : "Review the selected student and mentor match"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isReady ? (
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
                      {studentSkills.map((skill, index) => (
                        <Badge 
                          key={`student-skill-${index}`} 
                          variant="outline"
                          className={matchingSkills.includes(skill) ? "bg-green-50 text-green-700 border-green-200" : ""}
                        >
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
                      {mentorSkills.map((skill, index) => (
                        <Badge 
                          key={`mentor-skill-${index}`} 
                          variant="outline"
                          className={matchingSkills.includes(skill) ? "bg-green-50 text-green-700 border-green-200" : ""}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {matchingSkills.length > 0 && (
              <div className="col-span-1 md:col-span-2 mt-2">
                <h3 className="font-medium mb-2">Matching Skills</h3>
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex flex-wrap gap-1">
                    {matchingSkills.map((skill, index) => (
                      <Badge 
                        key={`matching-skill-${index}`}
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
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