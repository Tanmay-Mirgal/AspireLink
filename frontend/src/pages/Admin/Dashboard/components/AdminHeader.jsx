"use client"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell } from "@/pages/Admin/Dashboard/components/Bell"

export function AdminHeader({ activeTab }) {
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard"
      case "students":
        return "Students"
      case "mentors":
        return "Mentors"
      case "pending":
        return "Pending Registrations"
      case "approved":
        return "Approved Registrations"
      case "assign":
        return "Assign Mentor"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold truncate">{getHeaderTitle()}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Notifications</span>
        </Button>
      </div>
    </header>
  )
}