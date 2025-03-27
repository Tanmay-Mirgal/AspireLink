"use client"

import { useState,useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAdminStore } from "@/store/useAdminStore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// Sample data
import { chartData } from "@/pages/Admin/Dashboard/components/sampleData"

// Layout components
import { AdminSidebar } from "@/pages/Admin/Dashboard/components/AdminSidebar"
import { AdminHeader } from "@/pages/Admin/Dashboard/components/AdminHeader"

// Dashboard components
import { StatsCards } from "@/pages/Admin/Dashboard/components/StatsCards"
import { NetworkChart } from "@/pages/Admin/Dashboard/components/NetworkChart"
import { RecentUsers } from "@/pages/Admin/Dashboard/components/RecentUsers"

// Table components
import { StudentsTable } from "@/pages/Admin/Dashboard/components/StudentsTable"
import { MentorsTable } from "@/pages/Admin/Dashboard/components/MentorsTable"
import { PendingTable } from "@/pages/Admin/Dashboard/components/PendingTable"
import { ApprovedTable } from "@/pages/Admin/Dashboard/components/ApprovedTable"

// Assignment components
import { AssignmentForm } from "@/pages/Admin/Dashboard/components/AssignmentForm"
import { MatchDetails } from "@/pages/Admin/Dashboard/components/MatchDetails"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedMentor, setSelectedMentor] = useState(null)
  
  // Get data and functions from store
  const { 
    isLoading, 
    error, 
    clearError,
    students, 
    mentors, 
    pendingRegistrations, 
    approvedRegistrations,
    fetchAllData
  } = useAdminStore()
  
  // Fetch data on component mount
  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Handle clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-auto w-full">
          <AdminHeader activeTab={activeTab} />
          <main className="grid gap-6 p-4 md:p-6">
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {activeTab === "dashboard" && (
              <>
                <StatsCards 
                  students={students} 
                  mentors={mentors} 
                  pendingRegistrations={pendingRegistrations} 
                />
                <NetworkChart chartData={chartData} />
                <RecentUsers students={students} mentors={mentors} />
              </>
            )}

            {activeTab === "students" && (
              <StudentsTable students={students} />
            )}

            {activeTab === "mentors" && (
              <MentorsTable mentors={mentors} />
            )}

            {activeTab === "pending" && (
              <PendingTable pendingRegistrations={pendingRegistrations} />
            )}

            {activeTab === "approved" && (
              <ApprovedTable approvedRegistrations={approvedRegistrations} />
            )}

            {activeTab === "assign" && (
              <div className="grid gap-6">
                <AssignmentForm 
                  students={students} 
                  mentors={mentors} 
                  selectedStudent={selectedStudent}
                  setSelectedStudent={setSelectedStudent}
                  selectedMentor={selectedMentor}
                  setSelectedMentor={setSelectedMentor}
                />
                <MatchDetails
                  selectedStudent={selectedStudent}
                  selectedMentor={selectedMentor}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}