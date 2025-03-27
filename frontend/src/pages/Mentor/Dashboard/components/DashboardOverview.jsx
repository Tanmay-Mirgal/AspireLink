"use client"

import { StatsCard } from "./StatsCard"
import { ActivityChart } from "./ActivityChart"
import { StudentTable } from "./StudentTable"
import { RequestTable } from "./RequestTable"

export function DashboardOverview({ statsData, chartData, assignedStudents, pendingRequests }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <ActivityChart 
        title="Activity Overview" 
        description="Sessions conducted and mentoring requests over the last 6 months"
        data={chartData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <StudentTable 
          title="Assigned Students" 
          description={`You have ${assignedStudents.length} students assigned`}
          students={assignedStudents}
        />

        <RequestTable 
          title="Pending Requests" 
          description={`You have ${pendingRequests.length} pending mentoring requests`}
          requests={pendingRequests}
        />
      </div>
    </div>
  )
}