import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"

import { Award, BookOpen, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, XAxis, Bar, YAxis } from "recharts"

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
  const user = JSON.parse(localStorage.getItem('user'))
  const dummyBadges = [
    // { 
    //   name: "Profile Complete", 
    //   imageUrl: "https://res.cloudinary.com/dmspullpt/image/upload/v1743192423/WhatsApp_Image_2025-03-29_at_01.14.39_3b732309_vzigx9.jpg" 
       
    // },
    { 
      name: "Completed the First Course", 
      imageUrl: "https://res.cloudinary.com/dmspullpt/image/upload/v1743192478/WhatsApp_Image_2025-03-29_at_01.15.07_bfebd9cf_uhkjtg.jpg" 
       
    },
    { 
      name: "Confident Communicator", 
      imageUrl: "https://res.cloudinary.com/dmspullpt/image/upload/v1743192514/WhatsApp_Image_2025-03-29_at_01.15.45_d1c354c3_gvy4vh.jpg"
      
    },
    { 
      name: "Certified Learner", 
      imageUrl: "https://res.cloudinary.com/dmspullpt/image/upload/v1743192557/WhatsApp_Image_2025-03-29_at_01.16.17_d5928d91_ytdb1p.jpg"
       
    },
    { 
      name: "Mock Interview Expert", 
      imageUrl: "https://res.cloudinary.com/dmspullpt/image/upload/v1743192589/WhatsApp_Image_2025-03-29_at_01.16.43_bf11ac7e_ebk1yf.jpg"
   
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{user.fullName.firstName + " " + user.fullName.lastName} </CardTitle>
            <CardDescription>
              {user.studentProfile.skills[0].name} • Joined {user.createdAt.split("T")[0]}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {dummyBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center ">
                <div className={`${badge.color} p-2 rounded-full overflow-hidden `}>
                  <img 
                    src={badge.imageUrl} 
                    alt={badge.name} 
                    className="h-20 w-20 object-cover  "
                  />
                </div>
                <span className="text-xs mt-1 px-5">{badge.name}</span>
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
function JobEligibilityCard() {
    const jobEligibilityData = [
        { name: 'Data Scientist', score: 80 },
        { name: 'Software Engineer', score: 70 },
        { name: 'Product Manager', score: 90 },
        { name: 'UX Designer', score: 60 },
    ];
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
    // Prepare data for comparison radar chart
    const comparisonData = skillsData.map(skill => ({
      subject: skill.subject,
      studentSkill: skill.A, // Student's skill level
      industryBenchmark: skill.industryBenchmark, // Industry benchmark
      fullMark: 100
    }));
  
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Skills Comparison</CardTitle>
              <CardDescription>How your skills measure against industry standards</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="80%" 
                  data={comparisonData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Your Skills"
                    dataKey="studentSkill"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Industry Benchmark"
                    dataKey="industryBenchmark"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const studentSkill = payload.find(p => p.name === "Your Skills");
                        const industryBenchmark = payload.find(p => p.name === "Industry Benchmark");
                        
                        return (
                          <div className="bg-white p-4 border rounded shadow-lg">
                            <h4 className="font-bold mb-2">{payload[0].payload.subject}</h4>
                            <div className="space-y-1">
                              <p>Your Skill Level: <span className="font-semibold">{studentSkill?.value || 0}%</span></p>
                              <p>Industry Benchmark: <span className="font-semibold">{industryBenchmark?.value || 0}%</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Areas for skill development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonData
                .sort((a, b) => b.industryBenchmark - a.industryBenchmark)
                .map((skill) => (
                  <div key={skill.subject} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.subject}</span>
                      <span 
                        className={`text-sm font-semibold ${
                          skill.studentSkill >= skill.industryBenchmark 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}
                      >
                        {skill.studentSkill >= skill.industryBenchmark 
                          ? 'Above Benchmark' 
                          : `Gap: ${skill.industryBenchmark - skill.studentSkill}%`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          skill.studentSkill >= skill.industryBenchmark 
                            ? 'bg-green-600' 
                            : 'bg-red-600'
                        }`} 
                        style={{ 
                          width: `${Math.min(100, (skill.studentSkill / skill.industryBenchmark) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
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