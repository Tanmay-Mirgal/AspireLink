"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useMentorStore from "@/store/useMentorStore"
import { useEffect, useState } from "react"

export function RequestsSection() {
  const { 
    requests, 
    fetchRequests, 
    acceptMentorRequest, 
    declineRequest, 
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
      // Optionally, add success notification
    } catch (error) {
      console.error("Failed to accept request:", error);
      // Optionally, add error notification
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDeclineRequest = async (studentId) => {
    setProcessingRequestId(studentId);
    try {
      await declineRequest(studentId);
      // Optionally, add success notification
    } catch (error) {
      console.error("Failed to decline request:", error);
      // Optionally, add error notification
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