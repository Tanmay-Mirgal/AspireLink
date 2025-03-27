import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from "recharts"

export function SkillsTab({ skillsData, industrySkillsData }) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <SkillsRadarChart 
          title="Your Skills" 
          description="Current skill assessment based on your progress" 
          data={skillsData} 
          dataKey="A"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          name="Skills"
        />
        <SkillsRadarChart 
          title="Industry Requirements" 
          description="Skills required for industry positions" 
          data={industrySkillsData} 
          dataKey="A"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          name="Industry"
        />
      </div>
      <SkillBreakdownTable skillsData={skillsData} industrySkillsData={industrySkillsData} />
    </>
  )
}

function SkillsRadarChart({ title, description, data, dataKey, stroke, fill, name }) {
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
                name={name}
                dataKey={dataKey}
                stroke={stroke}
                fill={fill}
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillBreakdownTable({ skillsData, industrySkillsData }) {
  return (
    <Card>
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
            {skillsData.map((skill, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{skill.subject}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.A} className="h-2 w-24" />
                    <span className="text-sm">{skill.A}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={industrySkillsData[index].A} className="h-2 w-24" />
                    <span className="text-sm">{industrySkillsData[index].A}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {industrySkillsData[index].A - skill.A > 0 ? (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                      {industrySkillsData[index].A - skill.A}% gap
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