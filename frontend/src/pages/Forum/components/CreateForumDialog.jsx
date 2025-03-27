import React, { useState } from 'react';
import {useForumStore} from '@/store/useFormStore';
import { useNavigate } from 'react-router-dom';

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreateForumDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { isLoading, createForum } = useForumStore();
  const [formData, setFormData] = useState({ title: '', description: '' });
  
  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      const forum = await createForum(formData.title, formData.description);
      onOpenChange(false);
      setFormData({ title: '', description: '' });
      navigate(`/forums/${forum._id}`);
    } catch (error) {
      console.error('Failed to create forum:', error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Forum</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a forum for students to discuss topics related to your expertise.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateForum}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-300">
                Forum Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter forum title"
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-300">
                Description (Optional)
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this forum is about..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Create Forum
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateForumDialog;