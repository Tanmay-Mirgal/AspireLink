import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function OverviewTab({
  studentProfile,
  jobEligibilityData,
  skillsData,
  industrySkillsData,
  upcomingSessions
}) {
  return (
    <>
      <StudentProfileCard studentProfile={studentProfile} />
      <JobEligibilityCard jobEligibilityData={jobEligibilityData} />
      <SkillsComparisonCards skillsData={skillsData} industrySkillsData={industrySkillsData} />
      <UpcomingSessionsCard upcomingSessions={upcomingSessions} />
    </>
  )
}

// Student Profile Card
function StudentProfileCard({ studentProfile }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{studentProfile.name}</CardTitle>
            <CardDescription>
              {studentProfile.program} • Joined {studentProfile.joinDate}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {studentProfile.badges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`${badge.color} p-2 rounded-full`}>
                  <badge.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs mt-1">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Program Completion</span>
            <span className="text-sm font-medium">{studentProfile.completionPercentage}%</span>
          </div>
          <Progress value={studentProfile.completionPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

// Job Eligibility Card
function JobEligibilityCard({ jobEligibilityData }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Eligibility Based on Skills</CardTitle>
          <CardDescription>How your current skills match with industry job requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={jobEligibilityData}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 100 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 12 }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#4f46e5" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  label={{ 
                    position: 'right', 
                    formatter: (value) => `${value}%`, 
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm text-blue-600">
                            Match Score: <span className="font-bold">{payload[0].value}%</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
// Skills Comparison Cards
function SkillsComparisonCards({ skillsData, industrySkillsData }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Skills</CardTitle>
            <CardDescription>Current skill assessment</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Industry Requirements</CardTitle>
            <CardDescription>Skills required in the industry</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={industrySkillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Industry"
                  dataKey="A"
                  stroke="var(--chart-2)"
                  fill="var(--chart-2)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Upcoming Sessions Card
function UpcomingSessionsCard({ upcomingSessions }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled mentoring sessions</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View Calendar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <h3 className="font-medium">{session.title}</h3>
                <p className="text-sm text-muted-foreground">
                  with {session.mentor} • {session.duration}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{session.date}</p>
                <Button size="sm" className="mt-2">
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}