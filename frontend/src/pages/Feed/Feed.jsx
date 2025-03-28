import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserCircle2, 
  Settings, 
  Bell, 
  Mail, 
  ChevronDown, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  Image,
  Smile,
  MoreVertical,
  Trash2,
  Edit,
  X,
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { formatDistanceToNow } from 'date-fns';
import usePostStore from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';

// Connections and events data remains unchanged
const recentEvents = [
  {
    id: 1,
    title: "The Top Healthcare Events & Conferences of 2022",
    attendees: ["/api/placeholder/40/40", "/api/placeholder/40/40", "/api/placeholder/40/40"],
    views: 8
  },
  {
    id: 2,
    title: "World Health Care Congress (WHC2C)",
    attendees: ["/api/placeholder/40/40", "/api/placeholder/40/40"],
    views: 15
  }
];

const connections = [
  { name: "Dr. Lee Joseph", status: "online" },
  { name: "Dr. Richard James", status: "online" },
  { name: "Dr. Julie Joseph", status: "offline" },
  { name: "Dr. Mark Simpson", status: "offline" }
];

// Main Medical Social Feed Component
const MedicalSocialFeed = () => {
  const { 
    posts, 
    isLoading, 
    error, 
    pagination, 
    fetchPosts, 
    createPost, 
    updatePost, 
    deletePost, 
    likePost, 
    addComment, 
    deleteComment 
  } = usePostStore();
  
  const {
    user,
    getProfile,
    isLoading: profileLoading
  } = useAuthStore();

  const [page, setPage] = useState(1);
  const [commentMap, setCommentMap] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    if (!user) {
      getProfile().catch(err => {
        console.error("Error fetching profile:", err);
      });
    }
  }, [user, getProfile]);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  // Toggle comment visibility
  const toggleComments = (postId) => {
    setCommentMap(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Load more posts
  const loadMorePosts = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  // Helper functions for user data display
  const getFullName = (user) => {
    if (!user || !user.fullName) return 'Unknown User';
    return `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim();
  };

  const getInitials = (user) => {
    if (!user || !user.fullName) return 'U';
    const firstName = user.fullName.firstName || '';
    const lastName = user.fullName.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

  // Check if user has liked a post
  const hasLiked = (post) => {
    if (!user || !post.likes) return false;
    return post.likes.some(like => 
      like._id === user._id || like === user._id
    );
  };

  // Check if user is the author of a post
  const isAuthor = (post) => {
    if (!user || !post.author) return false;
    return post.author._id === user._id || post.author === user._id;
  };

  // Handle post deletion
  const handleDeletePost = () => {
    if (postToDelete) {
      deletePost(postToDelete);
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Create Post Dialog Component
  const CreatePostDialog = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveImage = () => {
      setImage(null);
      setImagePreview(null);
    };

    const handlePostCreate = async () => {
      if (content.trim()) {
        await createPost({
          title,
          content,
          image
        });
        
        // Reset form and close dialog
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        setOpen(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center space-x-2 mb-4 cursor-pointer bg-background border rounded-md p-3">
            <Avatar>
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>{user ? getInitials(user) : 'U'}</AvatarFallback>
            </Avatar>
            <Input 
              placeholder="What's on your mind?" 
              readOnly 
              onClick={() => setOpen(true)}
              className="flex-grow cursor-pointer bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback>{user ? getInitials(user) : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user ? getFullName(user) : 'User'}</p>
                <p className="text-xs text-muted-foreground">Medical Professional</p>
              </div>
            </div>
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title (optional)"
              className="w-full"
            />
            
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px]"
            />
            
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[200px] object-contain rounded-md" 
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-primary/10">
                    <Image className="h-5 w-5" />
                  </div>
                  <input 
                    type="file" 
                    id="image-upload" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              <Button 
                onClick={handlePostCreate}
                disabled={!content.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : 'Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Post Dialog Component
  const EditPostDialog = ({ post }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(post.title || '');
    const [content, setContent] = useState(post.content || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(post.img || null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRemoveImage = () => {
      setImage(null);
      setImagePreview(null);
    };

    const handlePostUpdate = async () => {
      if (content.trim()) {
        await updatePost(post._id, {
          title,
          content,
          image
        });
        
        // Close dialog
        setOpen(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-start">
            <Edit className="mr-2 h-4 w-4" /> Edit Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author?.profilePic} />
                <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{getFullName(post.author)}</p>
                <p className="text-xs text-muted-foreground">Medical Professional</p>
              </div>
            </div>
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title (optional)"
              className="w-full"
            />
            
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px]"
            />
            
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[200px] object-contain rounded-md" 
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <label htmlFor="edit-image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-primary/10">
                    <Image className="h-5 w-5" />
                  </div>
                  <input 
                    type="file" 
                    id="edit-image-upload" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePostUpdate}
                  disabled={!content.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Comment section component
  const CommentSection = ({ post }) => {
    const [commentContent, setCommentContent] = useState('');

    const handleAddComment = async (e) => {
      e.preventDefault();
      if (commentContent.trim()) {
        await addComment(post._id, commentContent);
        setCommentContent('');
      }
    };

    const handleDeleteComment = async (commentId) => {
      await deleteComment(post._id, commentId);
    };

    if (!commentMap[post._id]) return null;

    return (
      <div className="mt-4 space-y-4 px-4 pb-4">
        {/* Comment form */}
        <form onSubmit={handleAddComment} className="flex space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>{user ? getInitials(user) : 'U'}</AvatarFallback>
          </Avatar>
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow"
          />
          <Button type="submit" variant="outline" size="sm">
            Post
          </Button>
        </form>

        {/* Comments list */}
        <div className="space-y-3">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={comment.author?.profilePic} 
                    alt={getFullName(comment.author)} 
                  />
                  <AvatarFallback>{getInitials(comment.author)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow bg-muted rounded-md p-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{getFullName(comment.author)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                    </div>
                    {user && comment.author && (comment.author._id === user._id || comment.author === user._id) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-0 w-full">
      <div className="w-full mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Left Profile Section */}
        <div className="col-span-3 space-y-4">
          <Card className="w-full">
            <CardContent className="p-4">
              {profileLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Loading profile...</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Posts Section */}
        <div className="col-span-6 space-y-4">
          {/* Post Creation */}
          <CreatePostDialog />

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditPostDialog post={post} />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setPostToDelete(post._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              <CommentSection post={post} />
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
          {/* Recent Events */}
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <h3 className="font-semibold">Live Job Posting List</h3>
              <Button variant="ghost" size="sm">
                See all <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center mb-3">
                  <div className="flex -space-x-2 mr-3">
                    {event.attendees.map((attendee, index) => (
                      <Avatar key={index} className="w-8 h-8 border-2 border-background">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.views} seen</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* My Connections */}
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <h3 className="font-semibold">Networks</h3>
              <Input 
                placeholder="Search" 
                className="w-1/2 h-8 text-xs"
              />
            </CardHeader>
            <CardContent>
              {connections.map((connection, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <Avatar className="mr-3">
                      <AvatarFallback>
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p>{connection.name}</p>
                  </div>
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      connection.status === 'online' ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
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