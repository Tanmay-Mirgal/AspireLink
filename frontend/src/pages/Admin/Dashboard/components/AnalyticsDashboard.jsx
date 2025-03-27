"use client"

import { useEffect } from "react"
import { useAdminStore } from "@/store/useAdminStore"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Color constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AnalyticsDashboard() {
  const { analytics, getAnalytics, isLoading } = useAdminStore()

  // Fetch analytics data on component mount
  useEffect(() => {
    getAnalytics()
  }, [getAnalytics])

  // Format data for the assignment pie chart
  const assignmentData = [
    { name: 'Assigned Students', value: analytics.assignmentStats?.assignedStudents || 0 },
    { name: 'Unassigned Students', value: analytics.assignmentStats?.unassignedStudents || 0 }
  ]

  // Format data for the mentor status pie chart
  const mentorStatusData = [
    { name: 'Mentors With Students', value: analytics.assignmentStats?.mentorsWithStudents || 0 },
    { name: 'Mentors Without Students', value: analytics.assignmentStats?.mentorsWithoutStudents || 0 }
  ]

  // Format data for the profile completion pie chart
  const profileData = [
    { name: 'Completed Profiles', value: analytics.profileStats?.completedProfiles || 0 },
    { name: 'Incomplete Profiles', value: analytics.profileStats?.incompleteProfiles || 0 }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* <MetricCard 
          title="Profile Completion" 
          value={`${analytics.totalStudents ? Math.round((analytics.profileStats?.completedProfiles || 0) / analytics.totalStudents * 100) : 0}%`} 
          description="Student profile completion rate" 
        /> */}
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="growth" className="space-y-4">
          <GrowthChart data={analytics.monthlyGrowth || []} />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <AssignmentPieChart 
              title="Student Assignment Status" 
              data={assignmentData} 
              description="Students with and without assigned mentors" 
            />
            <AssignmentPieChart 
              title="Mentor Status" 
              data={mentorStatusData} 
              description="Mentors with and without assigned students" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4">
          <SkillsDistributionChart data={analytics.skillsDistribution || []} />
        </TabsContent>
        
        <TabsContent value="profiles" className="space-y-4">
          <AssignmentPieChart 
            title="Profile Completion" 
            data={profileData} 
            description="Student profile completion status" 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function GrowthChart({ data }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Network Growth</CardTitle>
        <CardDescription>Monthly growth of students, mentors, and connections</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#8884d8" name="Students" />
              <Bar dataKey="mentors" fill="#82ca9d" name="Mentors" />
              <Bar dataKey="connections" fill="#ffc658" name="Connections" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillsDistributionChart({ data }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skills Distribution</CardTitle>
        <CardDescription>Most popular skills among students and mentors</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" stackId="a" fill="#8884d8" name="Students" />
              <Bar dataKey="mentors" stackId="a" fill="#82ca9d" name="Mentors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function AssignmentPieChart({ title, data, description }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function SkillMatchingAnalytics() {
  const { analytics, getAnalytics, isLoading } = useAdminStore()

  // Fetch analytics data on component mount
  useEffect(() => {
    getAnalytics()
  }, [getAnalytics])

  // Create data for the skill gap analysis
  const skillGapData = analytics.skillsDistribution?.map(skill => ({
    name: skill.name,
    students: skill.students,
    mentors: skill.mentors,
    gap: skill.students - skill.mentors
  })) || []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skill Gap Analysis</CardTitle>
        <CardDescription>Difference between student needs and mentor availability</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillGapData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="gap" fill={({ gap }) => (gap > 0 ? "#ff8042" : "#82ca9d")} name="Skill Gap">
                {skillGapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.gap > 0 ? "#ff8042" : "#82ca9d"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}