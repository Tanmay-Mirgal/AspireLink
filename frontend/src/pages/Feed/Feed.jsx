import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  AlertCircle, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Heart 
} from 'lucide-react';

// Component Imports
import { CreatePostDialog } from './components/CreatePostDialog';
import { EditPostDialog } from './components/EditPostDialog';
import { CommentSection } from './components/CommentSection';
import { ProfileSidebar } from './components/ProfileSidebar';
import { JobListingSidebar } from './components/JobCard';
import { NetworkSidebar } from './components/NetworkSidebar';

// Store and Utility Imports
import usePostStore from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';
import useJobStore from '@/store/useJobStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getFullName, getInitials } from '@/pages/Feed/components/Helper';

// Confirmation Dialog
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MedicalSocialFeed = () => {
  const navigate = useNavigate();
  
  // Stores
  const { 
    posts, 
    isLoading, 
    error, 
    pagination, 
    fetchPosts, 
    likePost, 
    deletePost 
  } = usePostStore();
  
  const {
    user,
    getProfile,
    isLoading: profileLoading
  } = useAuthStore();

  const {
    jobs,
    isLoading: jobsLoading,
    error: jobsError,
    fetchAllJobs
  } = useJobStore();

  // State
  const [page, setPage] = useState(1);
  const [commentMap, setCommentMap] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    if (!user) {
      getProfile().catch(err => {
        console.error("Error fetching profile:", err);
      });
    }
    fetchPosts(page);
    fetchAllJobs();
  }, [user, page]);

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setCommentMap(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Check if current user has liked a post
  const hasLiked = (post) => {
    if (!user || !post.likes) return false;
    return post.likes.some((like) => 
      like._id === user._id || like === user._id
    );
  };

  // Check if current user is the author of a post
  const isAuthor = (post) => {
    if (!user || !post.author) return false;
    return post.author._id === user._id || post.author === user._id;
  };

  // Load more posts
  const loadMorePosts = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  // Handle post deletion
  const handleDeletePost = () => {
    if (postToDelete) {
      deletePost(postToDelete);
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-0 w-full">
      <div className="w-full mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Left Profile Section */}
        <ProfileSidebar 
          user={user} 
          isLoading={profileLoading} 
        />

        {/* Center Posts Section */}
        <div className="col-span-6 space-y-4">
          {/* Post Creation */}
          <CreatePostDialog user={user} />

          {/* Loading State */}
          {isLoading && posts.length === 0 && (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading posts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 mb-4 flex items-center bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error: {error}</span>
            </div>
          )}

          {/* Posts Display */}
          {posts.map((post) => (
            <Card key={post._id} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author?.profilePic} />
                    <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{getFullName(post.author)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                
                {isAuthor(post) && (
                  <EditPostDialog 
                    post={post} 
                    onDelete={() => {
                      setPostToDelete(post._id);
                      setDeleteDialogOpen(true);
                    }} 
                  />
                )}
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                {post.title && <h3 className="text-lg font-semibold mb-2">{post.title}</h3>}
                <p className="mb-3">{post.content}</p>
                
                {post.img && (
                  <img 
                    src={post.img} 
                    alt="Post" 
                    className="w-full rounded-lg mb-3"
                  />
                )}
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    {post.likes && post.likes.length > 0 && (
                      <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                    )}
                  </div>
                  <div>
                    {post.comments && post.comments.length > 0 && (
                      <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4 flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => likePost(post._id)}
                  className={hasLiked(post) ? "text-primary" : ""}
                >
                  {hasLiked(post) ? (
                    <Heart className="mr-2 h-4 w-4 fill-primary" />
                  ) : (
                    <ThumbsUp className="mr-2 h-4 w-4" />
                  )}
                  Like
                </Button>
                <Button variant="ghost" onClick={() => toggleComments(post._id)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Comment
                </Button>
                <Button variant="ghost">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </CardFooter>
              
              {/* Comments Section */}
              <CommentSection 
                post={post} 
                isVisible={commentMap[post._id]} 
              />
            </Card>
          ))}
          
          {/* Load More Button */}
          {pagination.currentPage < pagination.totalPages && (
            <div className="flex justify-center my-4">
              <Button 
                variant="outline" 
                onClick={loadMorePosts}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : 'Load More Posts'}
              </Button>
            </div>
          )}
          
          {/* No Posts Message */}
          {!isLoading && posts.length === 0 && (
            <Card className="w-full">
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>No posts available. Be the first to create a post!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-4">
          <JobListingSidebar 
            jobs={jobs} 
            isLoading={jobsLoading} 
            error={jobsError} 
          />
          <NetworkSidebar />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently deleted from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MedicalSocialFeed;