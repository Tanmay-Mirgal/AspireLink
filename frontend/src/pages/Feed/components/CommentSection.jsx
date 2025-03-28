import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

import usePostStore from '@/store/usePostStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getFullName, getInitials, formatDate } from '@/pages/Feed/components/Helper';


export const CommentSection = ({ post, isVisible }) => {
  const { addComment, deleteComment, isLoading } = usePostStore();
  const { user } = useAuthStore();
  const [commentContent, setCommentContent] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      try {
        await addComment(post._id, commentContent);
        setCommentContent('');
      } catch (error) {
        console.error('Failed to add comment', error);
        // Optionally show error to user
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
    } catch (error) {
      console.error('Failed to delete comment', error);
      // Optionally show error to user
    }
  };

  if (!isVisible) return null;

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
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="outline" 
          size="sm"
          disabled={!commentContent.trim() || isLoading}
        >
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
                      disabled={isLoading}
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