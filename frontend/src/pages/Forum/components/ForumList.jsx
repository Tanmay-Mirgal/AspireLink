import React from 'react';
import {useForumStore} from '@/store/useFormStore';
import {useAuthStore} from '@/store/useAuthStore';
import useForumActions from '../components/useForumActions';
import ForumItem from './ForumItem';
import LoadingStates from './LoadingStates';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

const ForumList = ({ setIsCreateDialogOpen }) => {
  const { user } = useAuthStore();
  const { forums, isLoading } = useForumStore();
  const { 
    activeTab, 
    setActiveTab, 
    filteredForums, 
    handleJoinForum 
  } = useForumActions();

  return (
    <Card className="md:col-span-4 lg:col-span-3 bg-gray-900 border-gray-800 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-800">
        <CardTitle className="text-xl font-bold text-white">Forums</CardTitle>
        {user?.role === 'mentor' && (
          <DialogTrigger asChild onClick={() => setIsCreateDialogOpen(true)}>
            <Button 
              size="sm" 
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" /> New
            </Button>
          </DialogTrigger>
        )}
      </CardHeader>
      <CardContent className="pb-2 pt-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full mb-4 bg-gray-800">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="joined" 
              className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Joined
            </TabsTrigger>
            {user?.role === 'mentor' && (
              <TabsTrigger 
                value="created" 
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Created
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </CardContent>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="px-4 py-2 space-y-2">
          {isLoading && !forums.length ? (
            <LoadingStates type="forum-list" count={5} />
          ) : filteredForums.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {activeTab === 'all' ? 'No forums available' : 
               activeTab === 'joined' ? 'You haven\'t joined any forums yet' : 
               'You haven\'t created any forums yet'}
            </div>
          ) : (
            filteredForums.map(forum => (
              <ForumItem 
                key={forum._id} 
                forum={forum} 
                handleJoinForum={handleJoinForum} 
              />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ForumList;