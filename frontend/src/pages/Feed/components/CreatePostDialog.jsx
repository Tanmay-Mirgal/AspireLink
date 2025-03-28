import React, { useState } from 'react';
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Image, 
  X, 
  Smile, 
  Loader2 
} from 'lucide-react';

import usePostStore from '@/store/usePostStore';
import { getFullName, getInitials } from '@/pages/Feed/components/Helper';



export const CreatePostDialog = ({ user }) => {
  const { createPost, isLoading } = usePostStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handlePostCreate = async () => {
    if (content.trim()) {
      try {
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
      } catch (error) {
        console.error('Failed to create post', error);
        // Optionally show error to user
      }
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