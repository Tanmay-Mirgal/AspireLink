"use client"

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { connectSocket } from '@/lib/socket';
import { useForumStore } from '@/store/useFormStore';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Forum card component
const ForumCard = ({ id, topic, description, memberCount }) => (
  <Link to={`/forum/${id}`} className="block">
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 mb-4">{description}</CardDescription>
        <Badge variant="secondary" className="font-normal">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </Badge>
      </CardContent>
    </Card>
  </Link>
);

// Create forum modal component
const CreateForumModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createForum, isLoading } = useForumStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createForum(title, description);
      setTitle('');
      setDescription('');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to create forum:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Forum</DialogTitle>
          <DialogDescription>
            Create a new discussion forum for your community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Forum Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter forum title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter forum description"
                className="resize-none h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Forum'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Forums = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { forums, isLoading, error, fetchAllForums } = useForumStore();

  useEffect(() => {
    // Connect to socket when component mounts
    connectSocket();
    
    // Fetch forums data
    fetchAllForums();
  }, [fetchAllForums]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[200px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => fetchAllForums()}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Forums</h1>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2"
        >
          <Plus size={18} />
          Create Forum
        </Button>
      </div>

      {forums.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Plus size={24} className="text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">No forums available. Create your first forum!</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Forum
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forums.map((forum) => (
            <ForumCard
              key={forum._id}
              id={forum._id}
              topic={forum.topic}
              description={forum.description}
              memberCount={forum.members.length}
            />
          ))}
        </div>
      )}

      <CreateForumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Forums;
