"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export function NetworkChart({ chartData }) {
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
              data={chartData}
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