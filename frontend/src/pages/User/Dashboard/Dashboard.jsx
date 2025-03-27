"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

// Import components


// Import data
import { 
  studentProfile, 
  assignedMentors, 
  skillsData, 
  industrySkillsData, 
  jobEligibilityData, 
  progressData, 
  upcomingSessions, 
  communityPosts 
} from "./data/studentData"
import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardTabs } from "./components/DashboardTabs"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar 
          studentProfile={studentProfile} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        <div className="flex-1 overflow-auto w-full">
          <DashboardHeader studentProfile={studentProfile} />
          <main className="p-6">
            <DashboardTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              studentProfile={studentProfile}
              assignedMentors={assignedMentors}
              skillsData={skillsData}
              industrySkillsData={industrySkillsData}
              jobEligibilityData={jobEligibilityData}
              progressData={progressData}
              upcomingSessions={upcomingSessions}
              communityPosts={communityPosts}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}