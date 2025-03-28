// JoinPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function JoinPage() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (name && roomId) {
      // Navigate to the meeting page with name as a query parameter
      navigate(`/meeting/${roomId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join Meeting</CardTitle>
          <CardDescription className="text-center">
            Enter your details to join the video conference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinMeeting} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Join Meeting</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Powered by ZegoCloud
        </CardFooter>
      </Card>
    </div>
  );
}

export default JoinPage;