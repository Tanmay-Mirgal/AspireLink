import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MentorsTab({ assignedMentors }) {
  return (
    <>
      <MentorCardsGrid assignedMentors={assignedMentors} />
      <SessionHistoryCard />
    </>
  )
}

// Mentor Cards Grid Component
function MentorCardsGrid({ assignedMentors }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mentors</CardTitle>
        <CardDescription>Mentors assigned to guide you through your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {assignedMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual Mentor Card Component
function MentorCard({ mentor }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-6 flex justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={mentor.name} />
          <AvatarFallback>
            {mentor.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{mentor.name}</CardTitle>
        <CardDescription>{mentor.expertise}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
          <span className="text-sm">{mentor.rating}/5.0 Rating</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">Next Session:</span> {mentor.nextSession}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Message
        </Button>
        <Button size="sm">Schedule</Button>
      </CardFooter>
    </Card>
  )
}

// Session History Card Component
function SessionHistoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session History</CardTitle>
        <CardDescription>Past mentoring sessions and feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Jul 10, 2023</TableCell>
              <TableCell>David Wilson</TableCell>
              <TableCell>JavaScript Fundamentals</TableCell>
              <TableCell>45 minutes</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  Excellent
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jul 5, 2023</TableCell>
              <TableCell>Sarah Chen</TableCell>
              <TableCell>UI Design Principles</TableCell>
              <TableCell>60 minutes</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  Good
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jun 28, 2023</TableCell>
              <TableCell>Michael Rodriguez</TableCell>
              <TableCell>API Integration</TableCell>
              <TableCell>45 minutes</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                  Satisfactory
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}