"use client"

import { UserCheck, Users, Clock, Search, UserPlus, CheckCircle, BarChart3, PieChart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <Sidebar className="border-r hidden md:flex flex-col z-10 top-0 sticky">
   <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-2">
    <h1 className="text-lg font-semibold truncate">Admin Dashboard</h1>
   </header>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("dashboard")} isActive={activeTab === "dashboard"}>
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("students")} isActive={activeTab === "students"}>
              <Users className="h-4 w-4" />
              <span>Students</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("mentors")} isActive={activeTab === "mentors"}>
              <UserCheck className="h-4 w-4" />
              <span>Mentors</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("pending")} isActive={activeTab === "pending"}>
              <Clock className="h-4 w-4" />
              <span>Pending Registrations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("approved")} isActive={activeTab === "approved"}>
              <CheckCircle className="h-4 w-4" />
              <span>Approved Registrations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("assign")} isActive={activeTab === "assign"}>
              <UserPlus className="h-4 w-4" />
              <span>Assign Mentor</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setActiveTab("analytics")} isActive={activeTab === "analytics"}>
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium">A</span>
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@mentorconnect.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}