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
        <div className="flex items-center space-x-2 mb-4 cursor-pointer bg-white border border-gray-200 rounded-md p-3">
          <Avatar>
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>{user ? getInitials(user) : 'U'}</AvatarFallback>
          </Avatar>
          <Input 
            placeholder="What's on your mind?" 
            readOnly 
            onClick={() => setOpen(true)}
            className="flex-grow cursor-pointer bg-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create a Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback>{user ? getInitials(user) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{user ? getFullName(user) : 'User'}</p>
              <p className="text-xs text-gray-500">Medical Professional</p>
            </div>
          </div>
          
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title (optional)"
            className="w-full bg-white border-gray-300 text-gray-800"
          />
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] bg-white border-gray-300 text-gray-800"
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
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Image className="h-5 w-5 text-gray-700" />
                </div>
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              onClick={handlePostCreate}
              disabled={!content.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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