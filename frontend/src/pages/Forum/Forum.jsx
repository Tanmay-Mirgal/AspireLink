import React from 'react';
import { useParams } from 'react-router-dom';
import {useForumStore} from '@/store/useFormStore';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

// Components
import ForumList from './components/ForumList';
import ForumHeader from './components/ForumHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import CreateForumDialog from './components/CreateForumDialog';
import EmptyState from './components/EmptyState';

// Custom hook for forum actions
import useForumActions from './components/useForumActions';

const ForumPage = () => {
  const { id } = useParams();
  const { 
    currentForum, 
    error, 
    clearError 
  } = useForumStore();
  
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    isCurrentForumMember,
    handleJoinForum 
  } = useForumActions();

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4 bg-red-950 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-red-300 hover:text-red-200 hover:bg-red-900/50" 
            onClick={clearError}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Forums List Sidebar */}
        <ForumList 
          isCreateDialogOpen={isCreateDialogOpen} 
          setIsCreateDialogOpen={setIsCreateDialogOpen} 
        />

        {/* Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col bg-gray-900 rounded-lg border border-gray-800 shadow-xl overflow-hidden">
          {currentForum ? (
            <>
              <ForumHeader />
              
              {isCurrentForumMember ? (
                <>
                  <MessageList />
                  <MessageInput />
                </>
              ) : (
                <EmptyState 
                  type="join-forum"
                  title="Join this forum to participate"
                  description="Only members can view messages and participate in discussions."
                  action={() => handleJoinForum(currentForum._id)}
                  actionText="Join Forum"
                />
              )}
            </>
          ) : (
            <EmptyState 
              type="select-forum"
              title="Select a forum to start chatting"
              description="Choose a forum from the list or create a new one to start discussing with other members."
            />
          )}
        </div>
      </div>

      {/* Create Forum Dialog */}
      <CreateForumDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default ForumPage;