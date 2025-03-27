"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, GitPullRequestDraft, ArrowUp, ArrowDown } from "lucide-react"

export function StatsCards({ students, mentors, pendingRegistrations, analytics }) {
  // Calculate percentages
  const assignmentRate = analytics?.totalStudents 
    ? Math.round((analytics.assignmentStats?.assignedStudents || 0) / analytics.totalStudents * 100) 
    : 0;
  
  const profileCompletionRate = analytics?.totalStudents 
    ? Math.round((analytics.profileStats?.completedProfiles || 0) / analytics.totalStudents * 100) 
    : 0;

  // Calculate month-over-month growth if available
  const currentMonth = analytics?.monthlyGrowth?.[analytics.monthlyGrowth.length - 1];
  const previousMonth = analytics?.monthlyGrowth?.[analytics.monthlyGrowth.length - 2];
  
  const studentGrowth = currentMonth && previousMonth 
    ? ((currentMonth.students - previousMonth.students) / previousMonth.students) * 100 
    : 0;
  
  const mentorGrowth = currentMonth && previousMonth 
    ? ((currentMonth.mentors - previousMonth.mentors) / previousMonth.mentors) * 100 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Students
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalStudents || students.length}</div>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground">
              {studentGrowth > 0 
                ? <span className="text-green-600 flex items-center"><ArrowUp className="h-3 w-3 mr-1" />{Math.abs(studentGrowth).toFixed(1)}% from last month</span>
                : studentGrowth < 0 
                  ? <span className="text-red-600 flex items-center"><ArrowDown className="h-3 w-3 mr-1" />{Math.abs(studentGrowth).toFixed(1)}% from last month</span>
                  : <span>No change from last month</span>
              }
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Mentors
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalMentors || mentors.length}</div>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-muted-foreground">
              {mentorGrowth > 0 
                ? <span className="text-green-600 flex items-center"><ArrowUp className="h-3 w-3 mr-1" />{Math.abs(mentorGrowth).toFixed(1)}% from last month</span>
                : mentorGrowth < 0 
                  ? <span className="text-red-600 flex items-center"><ArrowDown className="h-3 w-3 mr-1" />{Math.abs(mentorGrowth).toFixed(1)}% from last month</span>
                  : <span>No change from last month</span>
              }
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Assignment Rate
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assignmentRate}%</div>
          <p className="text-xs text-muted-foreground">
            {analytics?.assignmentStats?.assignedStudents || 0} of {analytics?.totalStudents || 0} students have mentors
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Applications
          </CardTitle>
          <GitPullRequestDraft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRegistrations.length}</div>
          <p className="text-xs text-muted-foreground">
            Profile completion rate: {profileCompletionRate}%
          </p>
        </CardContent>
      </Card>
    </div>
  )
}