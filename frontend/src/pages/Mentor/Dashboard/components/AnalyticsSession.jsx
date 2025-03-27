"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Sample data for analytics
const mentorHours = [
  { month: 'Jan', hours: 32 },
  { month: 'Feb', hours: 38 },
  { month: 'Mar', hours: 30 },
  { month: 'Apr', hours: 35 },
  { month: 'May', hours: 40 },
  { month: 'Jun', hours: 42 },
]

const studentProgressData = [
  { name: 'Excellent', value: 35 },
  { name: 'Good', value: 40 },
  { name: 'Average', value: 18 },
  { name: 'Needs Help', value: 7 },
]

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042']

export function AnalyticsSection({ chartData }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mentoring Hours</CardTitle>
            <CardDescription>Total hours spent mentoring students</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mentorHours}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Student performance distribution</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentProgressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studentProgressData.map((entry, index) => (
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mentoring Activity</CardTitle>
          <CardDescription>Breakdown of your mentoring activities</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#8884d8" name="Sessions" />
                <Bar dataKey="requests" fill="#82ca9d" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}