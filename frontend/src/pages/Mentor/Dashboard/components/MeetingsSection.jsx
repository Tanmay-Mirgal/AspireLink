import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

import { Plus } from "lucide-react"

export function MeetingsSection() {
    // Sample meetings data
    const meetings = [
      {
        id: 1,
        studentName: "Alex Johnson",
        topic: "Mock Interview: Web Development - React Components",
        date: "Today, 3:00 PM",
        duration: "45 minutes"
      },
      {
        id: 2,
        studentName: "Maria Garcia",
        topic: "Mentoring Session: Data Science - Python Data Visualization",
        date: "Tomorrow, 2:00 PM",
        duration: "60 minutes"
      },
      {
        id: 3,
        studentName: "James Wilson",
        topic: "Code Review: UX Design - Portfolio Review",
        date: "Jul 15, 4:30 PM",
        duration: "30 minutes"
      }
    ]
  
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Your scheduled mentoring sessions and mock interviews</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map(meeting => (
              <div key={meeting.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{meeting.topic}</h3>
                    <p className="text-sm text-muted-foreground">With: {meeting.studentName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{meeting.date}</p>
                    <p className="text-sm text-muted-foreground">{meeting.duration}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button size="sm">Join Meeting</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }