"use client"

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Download, 
  MessageSquare, 
  RefreshCw, 
  BarChart2 
} from 'lucide-react'

// Import the auth store
import { useAuthStore } from '@/store/useAuthStore'

// Import Shadcn UI components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

// Import Recharts for skill visualization
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts'



// Skill Graph Component
const SkillGraph = ({ skills }) => {
  // Transform skills data for Recharts
  const chartData = skills.map(skill => ({
    name: skill.name,
    proficiency: skill.proficiency,
    experience: skill.yearsOfExperience
  }))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="white" 
            className="opacity-20"
          />
          <XAxis 
            dataKey="none" 
            stroke="white"
            tick={{ fill: "white" }}
          />
          <YAxis 
            stroke="white"
            tick={{ fill: "white" }}
            domain={[0, 10]}
          />
          <RechartsTooltip 
            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-white/10">
                    <p className="font-bold text-white">{data.name}</p>
                    <p className="text-gray-300">Proficiency: {data.proficiency}/10</p>
                    <p className="text-gray-300">Experience: {data.experience} years</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="proficiency" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Markdown Styles
const markdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-white mb-3" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg font-medium text-white mb-2" {...props} />,
  p: ({node, ...props}) => <p className="text-gray-300 mb-4" {...props} />,
  a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc pl-6 text-gray-300 mb-4" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal pl-6 text-gray-300 mb-4" {...props} />,
  li: ({node, ...props}) => <li className="mb-2" {...props} />,
  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-4" {...props} />
}

// Profile Page Component
const ProfilePage = () => {
  const { user, getProfile, isLoading } = useAuthStore()
  const [refreshing, setRefreshing] = useState(false)

  // Default markdown content
  const defaultAboutMarkdown = `
# About Me

I am a passionate **Computer Science Professional** with extensive experience in bridging theoretical knowledge with practical applications. 

## My Mission
My core mission is to:
- Solve complex technical challenges
- Mentor aspiring developers
- Push the boundaries of innovation

## Key Strengths
- Strong problem-solving skills
- Expertise in modern web technologies
- Commitment to continuous learning

*Let's innovate together!*
`

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        await handleRefreshProfile()
      }
    }
    fetchProfile()
  }, [user])

  // Function to refresh profile
  const handleRefreshProfile = async () => {
    try {
      setRefreshing(true)
      await getProfile()
    } catch (error) {
      console.error('Failed to refresh profile', error)
      toast({
        title: "Profile Refresh Failed",
        description: "Unable to fetch profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Function for downloading CV
  const handleDownloadCV = () => {
    toast({
      title: "Download CV",
      description: "CV download functionality not implemented yet."
    })
  }

  // Function for contacting
  const handleContact = () => {
    toast({
      title: "Contact",
      description: "Contact functionality not implemented yet."
    })
  }

  // Initials generation for avatar fallback
  const getInitials = (user) => {
    if (user?.fullName?.firstName && user.fullName.lastName) {
      return `${user.fullName.firstName[0]}${user.fullName.lastName[0]}`
    }
    return 'U'
  }

  // Loading State
  if (isLoading || refreshing) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <Skeleton className="h-64 w-full bg-gray-800" />
      </div>
    )
  }

  // No User Data
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <Card className="w-[400px] bg-gray-900 border-gray-800">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-3xl font-bold text-blue-500 mb-4">Profile Not Found</h2>
            <Button 
              onClick={handleRefreshProfile} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Retry Fetching Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-8xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Main Profile Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-32 h-32 border-4 border-gray-800">
                  {user.profilePic ? (
                    <AvatarImage 
                      src={user.profilePic} 
                      alt={`${user.fullName?.firstName} ${user.fullName?.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-900/50 text-blue-300 text-3xl">
                      {getInitials(user)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-blue-500">
                        {user.fullName?.firstName} {user.fullName?.lastName}
                      </h1>
                      <Badge className="bg-blue-900/50 text-blue-300 mt-2">
                        {user.role || "Role Not Set"}
                      </Badge>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleRefreshProfile}
                            className="text-white/50 hover:text-blue-500"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white">
                          Refresh Profile
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-white/70">
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-gray-700" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleDownloadCV} className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download CV
                    </Button>
                    <Button 
                      onClick={handleContact} 
                      variant="outline" 
                      className="border-whitw text-black "
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Me Section with Markdown */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User className="mr-3 w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-white">About Me</h2>
              </div>
              <ReactMarkdown 
                components={markdownComponents}
              >
                {user.bio || defaultAboutMarkdown}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Skills Section */}
          {(user.role?.toLowerCase() === 'student' || user.role?.toLowerCase() === 'mentor') && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart2 className="mr-3 w-5 h-5 text-blue-500" />
                  Skills Proficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.role?.toLowerCase() === 'student' && user.studentProfile?.skills?.length ? (
                  <SkillGraph skills={user.studentProfile.skills} />
                ) : user.role?.toLowerCase() === 'mentor' && user.mentorSchema?.[0]?.skills?.length ? (
                  <ScrollArea className="h-48 w-full">
                    <div className="flex flex-wrap gap-2 pr-4">
                      {user.mentorSchema[0].skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-blue-900/50 text-blue-300"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-white/70 text-center">No skills available</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {user.role?.toLowerCase() === 'student' && user.studentProfile?.education?.length ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <GraduationCap className="mr-3 w-5 h-5 text-blue-500" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 w-full">
                  <div className="space-y-4 pr-4">
                    {user.studentProfile.education.map((edu, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                      >
                        <h4 className="font-semibold text-blue-400">{edu.degree}</h4>
                        <p className="text-white/70">
                          {edu.institution} - Graduated {edu.graduationYear}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : null}

          {/* Professional Details Section */}
          {user.role?.toLowerCase() === 'mentor' && user.mentorSchema?.[0] ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Briefcase className="mr-3 w-5 h-5 text-blue-500" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-400">
                      {user.mentorSchema[0].companyName || "Company Not Specified"}
                    </h4>
                    <p className="text-white/70 mt-2">
                      {user.mentorSchema[0].description || "No description provided"}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 text-blue-400">Experience</h5>
                    <p className="text-white/70">
                      {user.mentorSchema[0].experience || "Experience not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage