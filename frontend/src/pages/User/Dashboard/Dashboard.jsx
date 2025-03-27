"use client"
import { useStudentStore } from "@/store/useStudentStore"
import { useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

// Import components
import { DashboardHeader } from "./components/DashboardHeader"
import { DashboardSidebar } from "./components/DashboardSidebar"
import { DashboardTabs } from "./components/DashboardTabs"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function StudentDashboard() {
  const {
    studentProfile,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    initializeDashboard
  } = useStudentStore()

  // Initialize data when dashboard loads
  useEffect(() => {
    initializeDashboard()
  }, [initializeDashboard])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading your dashboard...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // If no student profile data loaded yet, show a placeholder
  if (!studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No student data available</p>
      </div>
    )
  }

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
            <DashboardTabs />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}