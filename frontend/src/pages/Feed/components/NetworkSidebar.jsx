import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from 'lucide-react';

// Hooks and Stores
import { useAuthStore } from '@/store/useAuthStore';

export const NetworkSidebar = () => {
  const navigate = useNavigate();
  const { 
    fetchRandomUsers, 
    isLoading: usersLoading, 
    error: usersError 
  } = useAuthStore();

  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch random users on component mount
  useEffect(() => {
    const loadRandomUsers = async () => {
      try {
        const users = await fetchRandomUsers();
        setConnections(users);
      } catch (error) {
        console.error('Failed to fetch random users', error);
      }
    };

    loadRandomUsers();
  }, []);

  // Filter connections based on search term
  const filteredConnections = connections.filter(connection => 
    `${connection.fullName.firstName} ${connection.fullName.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Helper to get full name
  const getFullName = (connection) => 
    `${connection.fullName.firstName} ${connection.fullName.lastName}`.trim();

  // Helper to get initials
  const getInitials = (connection) => 
    `${connection.fullName.firstName.charAt(0)}${connection.fullName.lastName.charAt(0)}`.toUpperCase();

  // Handle user profile navigation
  const handleUserProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="flex flex-row justify-between items-center border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Networks</h3>
        <Input 
          placeholder="Search" 
          className="w-1/2 h-8 text-xs bg-white border-gray-300 text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <CardContent className="bg-white">
        {usersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-3 w-1/2 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : usersError ? (
          <p className="text-center text-red-500">
            Failed to load connections: {usersError}
          </p>
        ) : filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <div 
              key={connection._id} 
              className="flex items-center justify-between mb-2 hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer"
              onClick={() => handleUserProfileClick(connection._id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  {connection.profilePic ? (
                    <AvatarImage 
                      src={connection.profilePic} 
                      alt={getFullName(connection)} 
                    />
                  ) : (
                    <AvatarFallback>
                      {getInitials(connection)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{getFullName(connection)}</p>
                  <p className="text-xs text-gray-500">
                    {connection.role || 'Medical Professional'}
                  </p>
                </div>
              </div>
              <div 
                className={`w-2 h-2 rounded-full ${
                  Math.random() > 0.5 ? 'bg-green-500' : 'bg-gray-400'
                }`}
                title={Math.random() > 0.5 ? 'Online' : 'Offline'}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">
            No connections found
          </p>
        )}
      </CardContent>
    </Card>
  );
};