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
  Smile
} from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const initialPosts = [
  {
    id: 1,
    author: "Dr. Richard James",
    authorInitials: "RJ",
    content: "The digestive system includes the mouth, pharynx (throat), esophagus, stomach, small intestine, large intestine, rectum...",
    timestamp: "2 min ago"
  },
  {
    id: 2,
    author: "Dr. Rosemary Sue",
    authorInitials: "RS",
    content: "Exploring human anatomy and its intricate systems.",
    timestamp: "Aug 21, 2022 07:05 PM"
  }
];

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

// Create Post Dialog Component
const CreatePostDialog = ({ 
  onPostCreate 
}) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handlePostCreate = () => {
    if (content.trim()) {
      onPostCreate({
        author: "Dr. User Name",
        authorInitials: "DR",
        content,
        image: image || undefined,
        timestamp: new Date().toLocaleString()
      });
      setContent('');
      setImage(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 mb-4 cursor-pointer">
          <Avatar>
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <Input 
            placeholder="What's happening?" 
            readOnly 
            className="flex-grow cursor-pointer"
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
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Dr. User Name</p>
              <p className="text-xs text-muted-foreground">Medical Specialist</p>
            </div>
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[150px]"
          />
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              onClick={handlePostCreate}
              disabled={!content.trim()}
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Medical Social Feed Component
const MedicalSocialFeed = () => {
  const [posts, setPosts] = useState(initialPosts);

  const handlePostCreate = (newPost) => {
    const postWithId = {
      ...newPost,
      id: posts.length + 1
    };
    setPosts([postWithId, ...posts]);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground p-0 w-full">
      <div className="w-full mx-auto grid grid-cols-12 gap-4 p-4">
        {/* Left Profile Section */}
        <div className="col-span-3 space-y-4">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-2">Dr. User Name</h3>
                <p className="text-sm text-muted-foreground mb-4">Medical Specialist</p>
                
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
            </CardContent>
          </Card>
        </div>

        {/* Center Posts Section */}
        <div className="col-span-6 space-y-4">
          {/* Post Input */}
          <CreatePostDialog onPostCreate={handlePostCreate} />

          {/* Posts */}
          {posts.map((post) => (
            <Card key={post.id} className="w-full">
              <CardHeader className="flex flex-row items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{post.authorInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3">{post.content}</p>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-between">
                  <Button variant="ghost">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                  </Button>
                  <Button variant="ghost">
                    <MessageCircle className="mr-2 h-4 w-4" /> Comment
                  </Button>
                  <Button variant="ghost">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3 space-y-4">
          {/* Recent Events */}
          <Card className="w-full">
            <CardHeader className="flex flex-row justify-between items-center">
              <h3 className="font-semibold">Recent Event 2022</h3>
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
              <h3 className="font-semibold">My Connections</h3>
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
    </div>
  );
};

export default MedicalSocialFeed;