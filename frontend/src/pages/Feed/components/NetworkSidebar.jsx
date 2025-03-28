import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Placeholder for connections data type


// Placeholder connections data
const defaultConnections = [
  { 
    id: '1', 
    name: 'Dr. Emily Chen', 
    status: 'online',
    profilePic: undefined 
  },
  { 
    id: '2', 
    name: 'Dr. Michael Rodriguez', 
    status: 'offline',
    profilePic: undefined 
  },
  { 
    id: '3', 
    name: 'Sarah Johnson', 
    status: 'online',
    profilePic: undefined 
  },
  { 
    id: '4', 
    name: 'Alex Patel', 
    status: 'offline',
    profilePic: undefined 
  },
  { 
    id: '5', 
    name: 'Dr. Lisa Wong', 
    status: 'online',
    profilePic: undefined 
  }
];

export const NetworkSidebar= () => {
  const [connections] = useState(defaultConnections);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter connections based on search term
  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center">
        <h3 className="font-semibold">Networks</h3>
        <Input 
          placeholder="Search" 
          className="w-1/2 h-8 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <div 
              key={connection.id} 
              className="flex items-center justify-between mb-2 hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {connection.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{connection.name}</p>
              </div>
              <div 
                className={`w-2 h-2 rounded-full ${
                  connection.status === 'online' 
                    ? 'bg-green-500' 
                    : 'bg-muted-foreground'
                }`}
                title={connection.status}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm">
            No connections found
          </p>
        )}
      </CardContent>
    </Card>
  );
};