import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export function AssessmentsSection({ pendingAssessments }) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Assessments</CardTitle>
          <CardDescription>Student assessments that need your review</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assessment Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.name}</TableCell>
                  <TableCell>{assessment.program}</TableCell>
                  <TableCell>{assessment.dueDate}</TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>
                    <Button size="sm">Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }