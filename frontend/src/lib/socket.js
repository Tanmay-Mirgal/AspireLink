// src/lib/socket.js

import { io } from 'socket.io-client';

// Create a socket instance
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
  withCredentials: true,
  autoConnect: false // Don't connect automatically
});

// Connect to the socket server
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect from the socket server
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Join a forum room
export const joinForumRoom = (forumId) => {
  socket.emit('join_forum', forumId);
};

// Leave a forum room
export const leaveForumRoom = (forumId) => {
  socket.emit('leave_forum', forumId);
};

// Send a new message
export const sendMessage = (messageData) => {
  socket.emit('new_message', messageData);
};

// Listen for receive message events
export const onReceiveMessage = (callback) => {
  socket.on('receive_message', callback);
};

// Remove event listeners
export const offReceiveMessage = (callback) => {
  socket.off('receive_message', callback);
};

export default socket;