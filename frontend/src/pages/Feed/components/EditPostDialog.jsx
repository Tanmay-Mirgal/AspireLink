import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Image, 
  X, 
  Edit, 
  Trash2,
  Loader2,
  MoreVertical
} from 'lucide-react';

import usePostStore from '@/store/usePostStore';
import { getFullName, getInitials } from '@/pages/Feed/components/Helper';



export const EditPostDialog = ({ post, onDelete }) => {
  const { updatePost, isLoading } = usePostStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(post.title || '');
  const [content, setContent] = useState(post.content || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post.img || null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
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
      try {
        await updatePost(post._id, {
          title,
          content,
          image
        });
        
        // Close dialog
        setOpen(false);
      } catch (error) {
        console.error('Failed to update post', error);
        // Optionally show error to user
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="flex items-center cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Post
            </DropdownMenuItem>
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
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onSelect={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};