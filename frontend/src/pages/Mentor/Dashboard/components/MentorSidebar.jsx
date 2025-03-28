"use client"

import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Home,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Settings,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function MentorSidebar({ activeTab, setActiveTab }) {
  return (
    <Sidebar className="border-r top-0 sticky z-10">
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-semibold">Mentor Portal</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "students"} onClick={() => setActiveTab("students")}>
              <Users className="h-4 w-4" />
              <span>Assigned Students</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "requests"} onClick={() => setActiveTab("requests")}>
              <MessageSquare className="h-4 w-4" />
              <span>Mentoring Requests</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "assessments"} onClick={() => setActiveTab("assessments")}>
              <FileText className="h-4 w-4" />
              <span>Pending Assessments</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "meetings"} onClick={() => setActiveTab("meetings")}>
              <Calendar className="h-4 w-4" />
              <span>Meetings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={activeTab === "analytics"} onClick={() => setActiveTab("analytics")}>
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Senior Mentor</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}