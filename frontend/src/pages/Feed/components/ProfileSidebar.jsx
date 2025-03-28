import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCircle2, 
  Settings, 
  Bell, 
  Mail 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

import { getFullName, getInitials } from '@/pages/Feed/components/Helper'

export const ProfileSidebar= ({ user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="col-span-3 space-y-4">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10 rounded-full" />
                ))}
              </div>
              
              <div className="w-full space-y-2">
                {[1, 2].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="col-span-3 space-y-4">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>
                {user ? getInitials(user) : 'U'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mb-2">
              {user ? getFullName(user) : 'User Name'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {user?.role || 'Medical Professional'}
            </p>
            
            <div className="flex space-x-2 mb-4">
              <Button variant="outline" size="icon">
                <UserCircle2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-full space-y-2">
              <Button variant="secondary" className="w-full">
                <Mail className="mr-2 h-4 w-4" /> Messages
              </Button>
              <Button variant="secondary" className="w-full">
                My Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};