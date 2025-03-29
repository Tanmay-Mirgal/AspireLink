import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Award, 
  MessageSquare,
  ArrowLeft,
  Edit,
  Share2,
  AlertCircle
} from 'lucide-react';

// Store and Hooks
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

// Main User Detail Profile Page
const UserDetailProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { fetchUserById } = useAuthStore();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const fetchedUser = await fetchUserById(userId);
        setUser(fetchedUser);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        toast.error('Unable to retrieve user profile');
        navigate('/network');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, fetchUserById, navigate]);

  // Initials generation for avatar fallback
  const getInitials = (user) => {
    if (user?.fullName?.firstName && user.fullName.lastName) {
      return `${user.fullName.firstName[0]}${user.fullName.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 bg-gray-200" />
              <Skeleton className="h-4 w-32 bg-gray-200" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No User Data
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <Card className="bg-white border border-red-200">
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                User Profile Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The profile you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                onClick={() => navigate('/network')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Network
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with Navigation and Actions */}
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden bg-white border border-gray-200">
        <div className="bg-blue-50 p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              {user.profilePic ? (
                <AvatarImage 
                  src={user.profilePic} 
                  alt={`${user.fullName?.firstName} ${user.fullName?.lastName}`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                  {getInitials(user)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-blue-700">
                {user.fullName?.firstName} {user.fullName?.lastName}
              </h2>
              <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                {user.role || "Role Not Set"}
              </Badge>
            </div>
          </div>
          <Button 
            variant="default" 
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </Card>

      {/* Profile Sections */}
      <div className="space-y-6">
        {/* Personal Information */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Basic details and contact information
            </CardDescription>
          </CardHeader>
          <Separator className="bg-gray-200" />
          <CardContent className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">
                  {user.fullName?.firstName} {user.fullName?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900 flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {user.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-500" />
                    {user.phone}
                  </p>
                </div>
              )}
              {user.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    {user.location}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        {(user.role?.toLowerCase() === 'student' || user.role?.toLowerCase() === 'mentor') && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Briefcase className="mr-2 h-5 w-5" />
                Professional Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                {user.role?.toLowerCase() === 'student' 
                  ? 'Academic details' 
                  : 'Professional experience'}
              </CardDescription>
            </CardHeader>
            <Separator className="bg-gray-200" />
            <CardContent className="p-6">
              {user.role?.toLowerCase() === 'student' && user.studentProfile ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Field of Study</p>
                    <p className="font-semibold text-gray-900">
                      {user.studentProfile.fieldOfStudy || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-semibold text-gray-900">
                      {user.studentProfile.institution || 'Not specified'}
                    </p>
                  </div>
                </div>
              ) : user.role?.toLowerCase() === 'mentor' && user.mentorSchema?.[0] ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-semibold text-gray-900">
                      {user.mentorSchema[0].companyName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-semibold text-gray-900">
                      {user.mentorSchema[0].experience || 'Not specified'}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {user.role?.toLowerCase() === 'student' && user.studentProfile?.education?.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <GraduationCap className="mr-2 h-5 w-5" />
                Education
              </CardTitle>
              <CardDescription className="text-gray-600">
                Academic background and qualifications
              </CardDescription>
            </CardHeader>
            <Separator className="bg-gray-200" />
            <CardContent className="p-0">
              <ScrollArea className="h-64 w-full">
                {user.studentProfile.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-blue-700">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        Graduated {edu.graduationYear}
                      </Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Skills Section */}
        {((user.role?.toLowerCase() === 'student' && user.studentProfile?.skills?.length) ||
          (user.role?.toLowerCase() === 'mentor' && user.mentorSchema?.[0]?.skills?.length)) && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <Award className="mr-2 h-5 w-5" />
                {user.role?.toLowerCase() === 'student' ? 'Skills' : 'Expertise'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Professional capabilities and strengths
              </CardDescription>
            </CardHeader>
            <Separator className="bg-gray-200" />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {user.role?.toLowerCase() === 'student'
                  ? user.studentProfile.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {skill.name}
                      </Badge>
                    ))
                  : user.mentorSchema?.[0]?.skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDetailProfilePage;