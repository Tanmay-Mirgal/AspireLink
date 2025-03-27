"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"



// Import mock data
import { 
  assignedStudents, 
  pendingRequests, 
  pendingAssessments,
  statsData,
  chartData
} from "./components/Data/mockData"
import { MentorSidebar } from "./components/MentorSidebar"
import { MentorHeader } from "./components/MentorHeader"
import { TabNavigation } from "./components/TabNavigation"
import { DashboardOverview } from "./components/DashboardOverview"
import { StudentsSection } from "./components/StudentsSection"
import { RequestsSection } from "./components/RequestsSection"
import { AssessmentsSection } from "./components/AssessmentsSection"
import { MeetingsSection } from "./components/MeetingsSection"
import { AnalyticsSection } from "./components/AnalyticsSession"


export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <MentorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 w-full overflow-auto">
          <MentorHeader />
          <main className="p-6">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === "overview" && (
              <DashboardOverview 
                statsData={statsData} 
                chartData={chartData}
                assignedStudents={assignedStudents}
                pendingRequests={pendingRequests}
              />
            )}

            {activeTab === "students" && (
              <StudentsSection assignedStudents={assignedStudents} />
            )}

            {activeTab === "requests" && (
              <RequestsSection pendingRequests={pendingRequests} />
            )}

            {activeTab === "assessments" && (
              <AssessmentsSection pendingAssessments={pendingAssessments} />
            )}

            {activeTab === "meetings" && (
              <MeetingsSection assignedStudents={assignedStudents} />
            )}

            {activeTab === "analytics" && (
              <AnalyticsSection chartData={chartData} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}