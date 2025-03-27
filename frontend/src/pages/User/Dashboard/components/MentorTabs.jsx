import { useEffect } from "react"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStudentStore } from "@/store/useStudentStore"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MentorsTab() {
  const { 
    assignedMentors, 
    isLoading, 
    error, 
    fetchAssignedMentors,
    sendMentorRequest
  } = useStudentStore()
  
  const [requestStatus, setRequestStatus] = useState(null)
  
  // Fetch mentors when component mounts
  useEffect(() => {
   
  
  }, [fetchAssignedMentors])
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading mentors...</p>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <Card className="p-6">
        <CardTitle className="text-red-500 mb-2">Error Loading Mentors</CardTitle>
        <p>{error}</p>
      </Card>
    )
  }
  
  // Function to handle sending a mentor request
  const handleSendRequest = async (mentorId) => {
    try {
      setRequestStatus({ loading: true, error: null, success: null })
      const result = await sendMentorRequest(mentorId)
      
      if (result.success) {
        setRequestStatus({ 
          loading: false, 
          error: null, 
          success: result.message || "Request sent successfully" 
        })
      } else {
        setRequestStatus({ 
          loading: false, 
          error: result.message || "Failed to send request", 
          success: null 
        })
      }
    } catch (error) {
      setRequestStatus({ 
        loading: false, 
        error: "An unexpected error occurred", 
        success: null 
      })
    }
  }

  return (
    <>
      {/* Status alert for mentor requests */}
      {requestStatus?.success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            {requestStatus.success}
          </AlertDescription>
        </Alert>
      )}
      
      {requestStatus?.error && (
        <Alert className="mb-4 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {requestStatus.error}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Show empty state when no mentors */}
      {(!assignedMentors || assignedMentors.length === 0) ? (
        <Card className="p-6 text-center">
          <CardTitle className="mb-4">No Mentors Assigned</CardTitle>
          <p className="mb-4">You don't have any mentors assigned yet.</p>
          <Button>Find a Mentor</Button>
        </Card>
      ) : (
        <>
          <MentorCardsGrid 
            assignedMentors={assignedMentors} 
            onSendRequest={handleSendRequest}
            requestLoading={requestStatus?.loading}
          />
          <SessionHistoryCard />
        </>
      )}
    </>
  )
}

// Mentor Cards Grid Component
function MentorCardsGrid({ assignedMentors, onSendRequest, requestLoading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Mentors</CardTitle>
        <CardDescription>Mentors assigned to guide you through your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {assignedMentors.map((mentor) => (
            <MentorCard 
              key={mentor.id} 
              mentor={mentor}
              onSendRequest={onSendRequest}
              requestLoading={requestLoading}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Individual Mentor Card Component
function MentorCard({ mentor, onSendRequest, requestLoading }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-6 flex justify-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={mentor.profilePic || `/placeholder.svg?height=96&width=96`} alt={mentor.name} />
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSendRequest(mentor.id)}
          disabled={requestLoading}
        >
          {requestLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Sending...
            </>
          ) : "Message"}
        </Button>
        <Button size="sm">Schedule</Button>
      </CardFooter>
    </Card>
  )
}

// Session History Card Component
function SessionHistoryCard() {
  // Mock session history data
  const sessionHistory = [
    {
      id: 'session1',
      date: '2023-07-10',
      mentorName: 'David Wilson',
      topic: 'JavaScript Fundamentals',
      duration: 45,
      feedback: { label: 'Excellent', style: 'green' }
    },
    {
      id: 'session2',
      date: '2023-07-05',
      mentorName: 'Sarah Chen',
      topic: 'UI Design Principles',
      duration: 60,
      feedback: { label: 'Good', style: 'blue' }
    },
    {
      id: 'session3',
      date: '2023-06-28',
      mentorName: 'Michael Rodriguez',
      topic: 'API Integration',
      duration: 45,
      feedback: { label: 'Satisfactory', style: 'yellow' }
    }
  ];

  return (
    <Card className="mt-6">
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
            {sessionHistory.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.mentorName}</TableCell>
                <TableCell>{session.topic}</TableCell>
                <TableCell>{session.duration} minutes</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`bg-${session.feedback.style}-50 text-${session.feedback.style}-700 hover:bg-${session.feedback.style}-50`}
                  >
                    {session.feedback.label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}