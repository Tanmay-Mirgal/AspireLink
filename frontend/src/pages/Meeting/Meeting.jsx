// Meeting.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Button } from '@/components/ui/button';

function MeetingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  
  useEffect(() => {
    // Parse the query parameters
    const searchParams = new URLSearchParams(location.search);
    const userName = searchParams.get('name');
    
    console.log("Username:", userName);
    console.log("Room ID:", roomId);

    if (!userName) {
      navigate('/meeting');
      return;
    }

    // ZegoCloud credentials
    const appID = 1850569340;
    const serverSecret = "ee4de7c0ddab7d25d0a7d2a4d519c8b0";

    // Generate a unique user ID
    const userId = new Date().getTime().toString();

    // Initialize ZegoCloud meeting
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join the room
    zp.joinRoom({
      container: document.querySelector('#meeting-container'),
      sharedLinks: [
        {
          name: 'Copy Room Link',
          url: `${window.location.origin}/meeting/${roomId}?name=${encodeURIComponent(userName)}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      onLeaveRoom: () => {
        navigate('/meeting');
      },
    });

    // Cleanup function
    return () => {
      zp.destroy();
    };
  }, [navigate, roomId, location.search]);

  return (
    <div className="w-full h-screen  flex flex-col">
      
      <div id="meeting-container" className="flex-grow h-screen"></div>
      
    </div>
  );
}

export default MeetingPage;