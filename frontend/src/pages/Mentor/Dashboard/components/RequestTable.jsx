"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare } from "lucide-react"
import useMentorStore from "@/store/useMentorStore"
import { useEffect, useState } from "react"

export function RequestsSection() {
  const { 
    requests, 
    fetchRequests, 
    acceptMentorRequest, 
    declineMentorRequest, 
    isLoading 
  } = useMentorStore();

  const [processingRequestId, setProcessingRequestId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAcceptRequest = async (studentId) => {
    setProcessingRequestId(studentId);
    try {
      await acceptMentorRequest(studentId);
      // Optionally, you can add a success notification here
    } catch (error) {
      console.error("Failed to accept request:", error);
      // Optionally, you can add an error notification here
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDeclineRequest = async (studentId) => {
    setProcessingRequestId(studentId);
    try {
      await declineMentorRequest(studentId);
      // Optionally, you can add a success notification here
    } catch (error) {
      console.error("Failed to decline request:", error);
      // Optionally, you can add an error notification here
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Mentoring Requests</CardTitle>
        <CardDescription>Review and respond to student mentoring requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No pending mentorship requests
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    {request.fullName.firstName} {request.fullName.lastName}
                  </TableCell>
                  <TableCell>{request.program || 'Not specified'}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.message || 'No additional message'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={processingRequestId === request._id}
                      >
                        {processingRequestId === request._id ? 'Processing...' : 'Accept'}
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDeclineRequest(request._id)}
                        disabled={processingRequestId === request._id}
                      >
                        {processingRequestId === request._id ? 'Processing...' : 'Decline'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function RequestTable({
  title = "Mentorship Requests",
  description = "View your mentorship requests",
  showAll = false,
  buttonText = "View All",
  showActions = false
}) {
  const { requests, fetchRequests, isLoading } = useMentorStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Date</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={showActions ? 4 : 3} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 4 : 3} className="text-center">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.slice(0, showAll ? undefined : 5).map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    {request.fullName.firstName} {request.fullName.lastName}
                  </TableCell>
                  <TableCell>{request.program || 'Not specified'}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  {showActions && (
                    <TableCell>
                      {/* Add action buttons if needed */}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!showAll && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline">
              {buttonText} <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}