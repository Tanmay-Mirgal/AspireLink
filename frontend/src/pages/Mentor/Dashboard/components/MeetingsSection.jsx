import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Users, 
  CalendarClock, 
  UserCheck, 
  UserX,
  Clock,
  Video,
  Loader2,
  AlertCircle,
  BriefcaseIcon,
  LinkIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

export function MeetingsSection({ role = 'mentor' }) {
  // State for API data
  const [meetings, setMeetings] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };
  
  // Fetch meeting data on component mount
  useEffect(() => {
    if (role === 'mentor') {
      fetchMeetingRequests();
    }
    fetchMeetings();
  }, [role]);
  
  // Fetch meeting requests (for mentors only)
  const fetchMeetingRequests = async () => {
    if (role !== 'mentor') return;
    
    setIsLoadingRequests(true);
    try {
      const response = await axiosInstance.get('/meetings/requests');
      setMeetingRequests(response.data.data || []);
    } catch (err) {
      console.error('Error fetching meeting requests:', err);
      toast.error('Failed to load meeting requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };
  
  // Fetch meetings
  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const endpoint = role === 'mentor' ? '/meetings/mentor-meetings' : '/meetings/student-meetings';
      const response = await axiosInstance.get(endpoint);
      
      if (response.data && response.data.meetings) {
        setMeetings(response.data.meetings);
      } else {
        setMeetings([]);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
      toast.error('Failed to load meetings');
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle accepting a meeting request
  const handleAccept = (request) => {
    setSelectedRequest(request);
    setIsScheduleDialogOpen(true);
  };
  
  // Handle rejecting a meeting request
  const handleReject = async (request) => {
    try {
      await axiosInstance.post('/meetings/respond-request', {
        meetingId: request.meetingId,
        requestId: request.requestId,
        action: 'rejected'
      });
      
      // Remove from local state
      setMeetingRequests(prev => prev.filter(r => r.requestId !== request.requestId));
      toast.success('Meeting request rejected');
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error('Failed to reject meeting request');
    }
  };
  
  // Handle scheduling a meeting (after accepting a request)
  const handleSubmitSchedule = async () => {
    if (!meetingDate || !meetingTime) {
      toast.error('Please select both date and time for the meeting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Accept the meeting request
      await axiosInstance.post('/meetings/respond-request', {
        meetingId: selectedRequest.meetingId,
        requestId: selectedRequest.requestId,
        action: 'accepted'
      });
      
      // Update the meeting with scheduled time
      await axiosInstance.post('/meetings/create-or-update', {
        meetingId: selectedRequest.meetingId,
        date: meetingDate,
        time: meetingTime,
      });
      
      // Update local state
      setMeetingRequests(prev => prev.filter(r => r.requestId !== selectedRequest.requestId));
      toast.success('Meeting scheduled successfully!');
      
      // Refresh meetings list
      fetchMeetings();
      
      // Close dialog and reset form
      setIsScheduleDialogOpen(false);
      setSelectedRequest(null);
      setMeetingDate('');
      setMeetingTime('');
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      toast.error('Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle creating a new meeting
  const handleCreateMeeting = async (data) => {
    // This would be implemented for the Create Meeting dialog
    // For now we'll just close the dialog
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          {role === 'mentor' && (
            <TabsTrigger value="requests">Meeting Requests</TabsTrigger>
          )}
        </TabsList>
        
        {/* Upcoming Meetings Tab */}
        <TabsContent value="upcoming">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled mentoring sessions and mock interviews</CardDescription>
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarClock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                    <p>No upcoming meetings scheduled</p>
                  </div>
                ) : (
                  meetings.map(meeting => {
                    // Extract student name for display
                    let studentNames = "students";
                    if (meeting.studentId && meeting.studentId.length > 0) {
                      if (typeof meeting.studentId[0] === 'object') {
                        studentNames = meeting.studentId.map(student => 
                          `${student.fullName?.firstName || ''} ${student.fullName?.lastName || ''}`
                        ).join(', ');
                      }
                    }
                    
                    // Format meeting date and time
                    const formattedDate = formatDate(meeting.date);
                    
                    return (
                      <div key={meeting._id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {role === 'mentor' ? `Meeting with ${studentNames}` : 
                               `Meeting with ${meeting.mentorId?.fullName?.firstName || 'Mentor'}`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formattedDate} at {meeting.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className={
                              meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              meeting.status === 'started' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {meeting.status || 'Pending'}
                            </Badge>
                            {meeting.passcode && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Passcode: {meeting.passcode}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          {role === 'mentor' && meeting.status === 'pending' && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Would implement update status logic here
                              }}
                            >
                              Reschedule
                            </Button>
                          )}
                          
                          {meeting.status === 'pending' && role === 'mentor' && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                // Would implement start meeting logic here
                              }}
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Start Meeting
                            </Button>
                          )}
                          
                          {meeting.status === 'started' && (
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join Meeting
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meeting Requests Tab (Mentor Only) */}
        {role === 'mentor' && (
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Meeting Requests
                </CardTitle>
                <CardDescription>Manage requests from students who applied to your job postings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : meetingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                    <p>No pending meeting requests</p>
                    <p className="text-sm mt-1">When students apply for your job postings, their requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meetingRequests.map((request) => (
                      <div 
                        key={request.requestId} 
                        className="rounded-lg border p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold">
                                {request.student.fullName?.firstName} {request.student.fullName?.lastName}
                              </h3>
                              <Badge variant="outline" className="ml-2 px-2 py-0 h-5">
                                <BriefcaseIcon className="h-3 w-3 mr-1" />
                                Job Applicant
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{request.student.email}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Request received: {formatDate(request.createdAt)}
                          </p>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(request)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAccept(request)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Schedule Meeting
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Schedule Meeting Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Set up a meeting time with {selectedRequest?.student.fullName?.firstName || 'the student'}.
              An email will be sent with the meeting details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="meeting-date">Meeting Date</Label>
              <Input
                id="meeting-date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="meeting-time">Meeting Time</Label>
              <Input
                id="meeting-time"
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsScheduleDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitSchedule}
              disabled={isSubmitting || !meetingDate || !meetingTime}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Meeting'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}