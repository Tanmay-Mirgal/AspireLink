import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStudentStore } from "@/store/useStudentStore"
import { Loader2 } from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts"

export function SkillsTab() {
  const { 
    skillsData, 
    industrySkillsData, 
    skillsAnalytics,
    isLoading, 
    error,
    fetchSkillsAnalytics 
  } = useStudentStore()
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <p>Loading skills data...</p>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <Card className="p-6">
        <CardTitle className="text-red-500 mb-2">Error Loading Skills Data</CardTitle>
        <p>{error}</p>
      </Card>
    )
  }
  
  // If no skills data available yet
  if (!skillsData || skillsData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CardTitle className="mb-4">No Skills Data Available</CardTitle>
        <p>Your skills assessment data hasn't been recorded yet.</p>
      </Card>
    )
  }

  // Create a combined data array for the radar chart
  const combinedChartData = skillsData.map(skill => {
    // Find matching industry benchmark
    const industrySkill = industrySkillsData.find(
      indSkill => indSkill.subject === skill.subject
    );
    
    return {
      subject: skill.subject,
      "Your Level": skill.A,
      "Industry Benchmark": industrySkill ? industrySkill.benchmark : 0
    };
  });

  return (
    <>
      <SkillsOverview skillsAnalytics={skillsAnalytics} />
      
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <CombinedSkillsRadarChart 
          title="Skills Comparison" 
          description="Your skills compared to industry standards" 
          data={combinedChartData} 
          yourLevelColor="#3b82f6"
          industryColor="#10b981"
        />
        <SkillsHighlightsCard 
          skills={skillsData}
          topSkills={skillsAnalytics?.topSkills || []}
        />
      </div>
      
      <SkillBreakdownTable 
        skillsData={skillsData} 
        industrySkillsData={industrySkillsData} 
        skillGapAnalysis={skillsAnalytics?.skillGapAnalysis}
      />
    </>
  )
}

function SkillsOverview({ skillsAnalytics }) {
  if (!skillsAnalytics) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Overview</CardTitle>
        <CardDescription>Your current skill level compared to industry standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{skillsAnalytics.totalSkills}</p>
              <p className="text-sm text-muted-foreground">Skills tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Skills Acquired</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{skillsAnalytics.skillsCovered}</p>
              <p className="text-sm text-muted-foreground">Skills with proficiency</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Average Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{skillsAnalytics.averageStudentProficiency.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Across all skills</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Top Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {skillsAnalytics.topSkills && skillsAnalytics.topSkills.length > 0 ? (
                <div>
                  {skillsAnalytics.topSkills.slice(0, 2).map((skill, index) => (
                    <div key={index} className={index > 0 ? "mt-2" : ""}>
                      <p className="font-medium">{skill.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {skill.A}% proficiency
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills data</p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

function CombinedSkillsRadarChart({ title, description, data, yourLevelColor, industryColor }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              
              <Radar
                name="Your Level"
                dataKey="Your Level"
                stroke={yourLevelColor}
                fill={yourLevelColor}
                fillOpacity={0.6}
              />
              
              <Radar
                name="Industry Benchmark"
                dataKey="Industry Benchmark"
                stroke={industryColor}
                fill={industryColor}
                fillOpacity={0.4}
              />
              
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillsHighlightsCard({ skills, topSkills }) {
  // Get the top 2 skills
  const displaySkills = topSkills.slice(0, 2);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Top Skills</CardTitle>
        <CardDescription>Areas where you excel compared to industry standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {displaySkills.length > 0 ? (
            displaySkills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">{skill.subject}</h3>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300">
                    {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Your level</span>
                      <span className="text-sm font-medium">{skill.A}%</span>
                    </div>
                    <Progress value={skill.A} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Industry benchmark</span>
                      <span className="text-sm font-medium">{skill.industryBenchmark}%</span>
                    </div>
                    <Progress value={skill.industryBenchmark} className="h-2 bg-green-100" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {skill.A >= skill.industryBenchmark 
                      ? `You exceed the industry standard by ${(skill.A - skill.industryBenchmark).toFixed(1)}%`
                      : `You are ${(skill.industryBenchmark - skill.A).toFixed(1)}% away from the industry standard`
                    }
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-muted-foreground">No skill proficiency recorded yet</p>
              <Button className="mt-4" variant="outline">Take Skills Assessment</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SkillBreakdownTable({ skillsData, industrySkillsData, skillGapAnalysis }) {
  // If we have the gap analysis from the API, use it. Otherwise, calculate it.
  const gapData = skillGapAnalysis || skillsData.map((skill, index) => {
    const industrySkill = industrySkillsData.find(ind => ind.subject === skill.subject) || 
                          { benchmark: 0 };
    
    return {
      subject: skill.subject,
      studentLevel: skill.A,
      industryBenchmark: industrySkill.benchmark,
      gap: Math.max(industrySkill.benchmark - skill.A, 0)
    };
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Detailed analysis of your skills and areas for improvement</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Your Level</TableHead>
              <TableHead>Industry Standard</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Recommended Resources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gapData.map((skill, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{skill.subject}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.studentLevel} className="h-2 w-24" />
                    <span className="text-sm">{skill.studentLevel}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.industryBenchmark} className="h-2 w-24" />
                    <span className="text-sm">{skill.industryBenchmark}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {skill.gap > 0 ? (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                      {skill.gap}% gap
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      On par
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    View Resources
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}