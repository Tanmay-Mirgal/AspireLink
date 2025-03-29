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
        <Card className="w-full bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full mb-4 bg-gray-200" />
              <Skeleton className="h-4 w-3/4 mb-2 bg-gray-200" />
              <Skeleton className="h-3 w-1/2 mb-4 bg-gray-200" />
              
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="w-10 h-10 rounded-full bg-gray-200" />
                ))}
              </div>
              
              <div className="w-full space-y-2">
                {[1, 2].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full bg-gray-200" />
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
      <Card className="w-full bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>
                {user ? getInitials(user) : 'U'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mb-2 text-gray-900">
              {user ? getFullName(user) : 'User Name'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {user?.role || 'Medical Professional'}
            </p>
            
            <div className="flex space-x-2 mb-4">
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <UserCircle2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-full space-y-2">
              <a href='/message'>
                <Button variant="secondary" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300">
                  <Mail className="mr-2 h-4 w-4" /> Messages
                </Button>
              </a>
              <a href='/profile'>
                <Button variant="secondary" className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300">
                  My Profile
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};