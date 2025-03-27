import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStudentStore } from "@/store/useStudentStore"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ConnectionsTab() {
  const { 
    assignedMentors, 
    unassignedMentors,
    requestedMentors,
    isLoading, 
    error,
    fetchUnassignedMentors,
    sendMentorRequest
  } = useStudentStore()
  
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [requestStatus, setRequestStatus] = useState(null)
  const [showMentorDialog, setShowMentorDialog] = useState(false)
  
  // Fetch unassigned mentors if not already loaded
  useEffect(() => {
    if (unassignedMentors.length === 0) {
      fetchUnassignedMentors()
    }
  }, [unassignedMentors, fetchUnassignedMentors])
  
  // Handle sending mentor request
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
        setShowMentorDialog(false)
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
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading connections...</p>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <Card className="p-6">
        <CardTitle className="text-red-500 mb-2">Error Loading Connections</CardTitle>
        <p>{error}</p>
      </Card>
    )
  }

  return (
    <>
      {/* Status alert for requests */}
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
      
      <NetworkOverviewCards 
        mentorsCount={assignedMentors.length} 
        pendingRequestsCount={requestedMentors.length}
      />
      
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Mentors</CardTitle>
            <CardDescription>Mentors you can connect with</CardDescription>
          </div>
          <Button size="sm" onClick={() => fetchUnassignedMentors()}>
            Refresh List
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unassignedMentors.length > 0 ? (
                unassignedMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mentor.profilePic} alt={mentor.name} />
                          <AvatarFallback>
                            {mentor.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{mentor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{mentor.expertise}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mentor.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                        {mentor.skills.length > 2 && (
                          <Badge variant="outline">+{mentor.skills.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{mentor.experience.split(' ')[0]}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedMentor(mentor)
                          setShowMentorDialog(true)
                        }}
                        disabled={requestedMentors.includes(mentor.id)}
                      >
                        {requestedMentors.includes(mentor.id) ? "Requested" : "View Profile"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No available mentors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pending Requests Card */}
      <PendingRequestsCard requestedMentors={requestedMentors} />
      
      {/* Mentor Profile Dialog */}
      {selectedMentor && (
        <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mentor Profile</DialogTitle>
              <DialogDescription>
                View mentor details and send a connection request
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={selectedMentor.profilePic} alt={selectedMentor.name} />
                <AvatarFallback className="text-xl">
                  {selectedMentor.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-bold">{selectedMentor.name}</h3>
              <p className="text-muted-foreground mb-4">{selectedMentor.expertise}</p>
              
              <div className="space-y-4 w-full">
                <div>
                  <h4 className="font-medium mb-1">Bio</h4>
                  <p className="text-sm">{selectedMentor.bio}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMentor.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                    {selectedMentor.skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Experience</h4>
                  <p className="text-sm">{selectedMentor.experience}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowMentorDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleSendRequest(selectedMentor.id)}
                disabled={requestStatus?.loading || requestedMentors.includes(selectedMentor.id)}
              >
                {requestStatus?.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : requestedMentors.includes(selectedMentor.id) ? (
                  "Request Sent"
                ) : (
                  "Send Request"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function NetworkOverviewCards({ mentorsCount, pendingRequestsCount }) {
  // Sample data for peers and industry professionals
  const peersCount = 12
  const professionalsCount = 5

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Network</CardTitle>
        <CardDescription>Connect with mentors, peers, and industry professionals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4">
          <NetworkCard 
            title="Mentors" 
            description="Your assigned mentors" 
            count={mentorsCount} 
            buttonText="View Mentors" 
            linkTo="mentors"
          />
          <NetworkCard 
            title="Pending Requests" 
            description="Sent mentor requests" 
            count={pendingRequestsCount} 
            buttonText="View Requests" 
          />
          <NetworkCard 
            title="Peers" 
            description="Fellow students" 
            count={peersCount} 
            buttonText="View Peers" 
          />
          <NetworkCard 
            title="Industry" 
            description="Professional connections" 
            count={professionalsCount} 
            buttonText="View Professionals" 
          />
        </div>
      </CardContent>
    </Card>
  )
}

function NetworkCard({ title, description, count, buttonText, linkTo }) {
  const { setActiveTab } = useStudentStore()
  
  const handleClick = () => {
    if (linkTo) {
      setActiveTab(linkTo)
    }
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground">
          {count === 1 ? 'Active connection' : 'Active connections'}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

function PendingRequestsCard({ requestedMentors }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
        <CardDescription>Mentor connection requests you've sent</CardDescription>
      </CardHeader>
      <CardContent>
        {requestedMentors.length > 0 ? (
          <div className="space-y-4">
            {requestedMentors.map((mentorId) => (
              <div key={mentorId} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p>Request sent to mentor ID: {mentorId}</p>
                  <p className="text-sm text-muted-foreground">Awaiting response</p>
                </div>
                <Badge>Pending</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't sent any requests yet</p>
            <Button variant="outline">Browse Mentors</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}