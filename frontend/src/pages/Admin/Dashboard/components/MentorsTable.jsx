"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MentorsTable({ mentors }) {
  const [searchMentors, setSearchMentors] = useState("")

  // Filter mentors based on search input
  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchMentors.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchMentors.toLowerCase()) ||
      (Array.isArray(mentor.skills) && mentor.skills.some(skill => 
        skill.toLowerCase().includes(searchMentors.toLowerCase())
      ))
  )

  return (
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
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
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
                      {Array.isArray(mentor.skills) && mentor.skills.map((skill, index) => (
                        <Badge key={`${mentor.id}-skill-${index}`} variant="outline">
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
        </div>
      </CardContent>
    </Card>
  )
}