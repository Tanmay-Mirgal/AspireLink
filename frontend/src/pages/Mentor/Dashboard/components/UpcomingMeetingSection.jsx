import React, { useEffect, useState } from 'react';
import { Plus, CalendarClock, Loader2, AlertCircle, Video, Clock, Users, LinkIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { axiosInstance } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function UpcomingMeetingsSection({ role = 'mentor' }) {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields for new meeting
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [studentIds, setStudentIds] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  
  // Fetch meetings based on user role
  const fetchMeetings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = role === 'mentor' ? '/meetings/mentor-meetings' : '/meetings/student-meetings';
      const response = await axiosInstance.get(endpoint);
      
      // Format meetings data
      const meetingsData = response.data.meetings.map(meeting => ({
        ...meeting,
        formattedDate: new Date(meeting.date).toLocaleDateString(),
        statusBadgeColor: getStatusColor(meeting.status)
      }));
      
      setMeetings(meetingsData);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(err.response?.data?.message || 'Failed to load meetings');
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get color based on meeting status
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'started': return 'bg-green-100 text-green-800 border-green-200';
      case 'finished': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Fetch available students for mentor
  const fetchAvailableStudents = async () => {
    if (role !== 'mentor') return;
    
    try {
      const response = await axiosInstance.get('/mentor/get-student-assigned');
      setAvailableStudents(response.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      toast.error('Failed to load available students');
    }
  };
  
  useEffect(() => {
    fetchMeetings();
    if (role === 'mentor') {
      fetchAvailableStudents();
    }
  }, [role]);
  
  const handleCreateMeeting = async () => {
    if (!meetingDate || !meetingTime || studentIds.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/meetings/create-or-update', {
        date: meetingDate,
        time: meetingTime,
        students: studentIds
      });
      
      toast.success('Meeting created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchMeetings();
    } catch (err) {
      console.error('Error creating meeting:', err);
      toast.error(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateStatus = async (meetingId, newStatus) => {
    try {
      await axiosInstance.put(`/meetings/status/${meetingId}`, {
        status: newStatus
      });
      
      // Update local state
      setMeetings(meetings.map(meeting => 
        meeting._id === meetingId 
          ? { 
              ...meeting, 
              status: newStatus,
              statusBadgeColor: getStatusColor(newStatus)
            } 
          : meeting
      ));
      
      toast.success(`Meeting ${newStatus}`);
    } catch (err) {
      console.error('Error updating meeting status:', err);
      toast.error(err.response?.data?.message || 'Failed to update meeting status');
    }
  };
  
  const resetForm = () => {
    setMeetingDate('');
    setMeetingTime('');
    setStudentIds([]);
    setSelectedMeeting(null);
  };
  
  const handleStudentSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setStudentIds(selectedOptions);
  };
  
  // Copy meeting passcode to clipboard
  const copyPasscode = (passcode) => {
    navigator.clipboard.writeText(passcode);
    toast.success('Passcode copied to clipboard');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4">Loading meetings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="mt-4 font-medium">Error loading meetings</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button className="mt-4" onClick={fetchMeetings}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <CalendarClock className="mr-2 h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>Your scheduled mentoring sessions</CardDescription>
          </div>
          {role === 'mentor' && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <CalendarClock className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="font-medium">No upcoming meetings</p>
              {role === 'mentor' ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule a meeting with your students to get started
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  Your mentor will schedule meetings with you when needed
                </p>
              )}
              {role === 'mentor' && (
                <Button 
                  className="mt-4" 
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Schedule a Meeting
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div 
                  key={meeting._id} 
                  className="rounded-lg border p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold">Meeting with {
                          role === 'mentor' 
                            ? `${meeting.studentId.length} student${meeting.studentId.length !== 1 ? 's' : ''}`
                            : (meeting.mentorId?.fullName
                                ? `${meeting.mentorId.fullName.firstName} ${meeting.mentorId.fullName.lastName}`
                                : 'your mentor')
                        }</h3>
                        <Badge 
                          className={`ml-2 px-2 py-0 h-5 ${meeting.statusBadgeColor}`} 
                          variant="outline"
                        >
                          {meeting.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {meeting.formattedDate} at {meeting.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meeting.passcode && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyPasscode(meeting.passcode)}
                          className="flex items-center"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Copy Code
                        </Button>
                      )}
                      
                      {role === 'mentor' && meeting.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateStatus(meeting._id, 'started')}
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Start Meeting
                        </Button>
                      )}
                      
                      {role === 'mentor' && meeting.status === 'started' && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(meeting._id, 'finished')}
                        >
                          End Meeting
                        </Button>
                      )}
                      
                      {meeting.status === 'started' && (
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Show participants */}
                  <div className="mt-3 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {role === 'mentor' ? 'Students: ' : 'Participants: '}
                      {role === 'mentor'
                        ? (meeting.studentId.map(student => 
                            `${student.fullName?.firstName || ''} ${student.fullName?.lastName || ''}`
                          ).join(', ') || 'No students assigned')
                        : `You, ${meeting.mentorId?.fullName?.firstName || 'your mentor'}`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Create a new meeting with your assigned students. They will receive an email with the meeting details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="grid gap-2">
              <Label htmlFor="students">Select Students</Label>
              <select
                id="students"
                multiple
                size={4}
                className="border rounded-md p-2"
                onChange={handleStudentSelection}
                required
              >
                {availableStudents.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.fullName?.firstName} {student.fullName?.lastName} ({student.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Hold Ctrl/Cmd to select multiple students
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMeeting}
              disabled={isSubmitting || !meetingDate || !meetingTime || studentIds.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
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