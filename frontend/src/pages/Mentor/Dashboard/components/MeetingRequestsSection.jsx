import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle,
  BriefcaseIcon,
  CalendarDays,
  Clock3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const MeetingRequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMeetingRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/meetings/requests');
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load meeting requests');
      toast.error('Failed to load meeting requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingRequests();
  }, []);

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setIsScheduleDialogOpen(true);
  };

  const handleReject = async (request) => {
    try {
      await axiosInstance.post('/meetings/respond-request', {
        meetingId: request.meetingId,
        requestId: request.requestId,
        action: 'rejected'
      });
      
      // Remove from local state
      setRequests(prev => prev.filter(r => r.requestId !== request.requestId));
      toast.success('Meeting request rejected');
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error(err.response?.data?.message || 'Failed to reject meeting request');
    }
  };

  const handleSubmitSchedule = async () => {
    if (!meetingDate || !meetingTime) {
      toast.error('Please select both date and time for the meeting');
      return;
    }

    setIsSubmitting(true);
    try {
      // First accept the request
      await axiosInstance.post('/meetings/respond-request', {
        meetingId: selectedRequest.meetingId,
        requestId: selectedRequest.requestId,
        action: 'accepted'
      });
      
      // Then update the meeting with scheduled time
      await axiosInstance.post('/meetings/create-or-update', {
        meetingId: selectedRequest.meetingId,
        date: meetingDate,
        time: meetingTime,
      });
      
      // Update local state
      setRequests(prev => prev.filter(r => r.requestId !== selectedRequest.requestId));
      toast.success('Meeting scheduled successfully! A notification has been sent to the student.');
      setIsScheduleDialogOpen(false);
      setSelectedRequest(null);
      setMeetingDate('');
      setMeetingTime('');
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Requests</CardTitle>
          <CardDescription>Manage requests from students who applied to your job postings</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4">Loading meeting requests...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting Requests</CardTitle>
          <CardDescription>Manage requests from students who applied to your job postings</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="mt-4 font-medium">Error loading meeting requests</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button className="mt-4" onClick={fetchMeetingRequests}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5" />
            Meeting Requests
          </CardTitle>
          <CardDescription>Manage requests from students who applied to your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="font-medium">No pending meeting requests</p>
              <p className="text-sm text-muted-foreground mt-1">
                When students apply for your job postings, their requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
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
                      Request received: {new Date(request.createdAt).toLocaleDateString()}
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
                <>
                  <Clock3 className="h-4 w-4 mr-2" />
                  Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingRequestsSection;