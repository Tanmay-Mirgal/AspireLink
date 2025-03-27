import {
    Home,
    LayoutDashboard,
    Users,
    BarChart2,
    MessageSquare,
    FileText,
    PieChart,
    Settings
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
  
  export function DashboardSidebar({ studentProfile, activeTab, setActiveTab }) {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-lg font-semibold">Student Portal</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")}
              >
                <Home />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "mentors"} 
                onClick={() => setActiveTab("mentors")}
              >
                <Users />
                <span>Mentors Assigned</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "skills"} 
                onClick={() => setActiveTab("skills")}
              >
                <BarChart2 />
                <span>Skills Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "connections"} 
                onClick={() => setActiveTab("connections")}
              >
                <MessageSquare />
                <span>Connections</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "posts"} 
                onClick={() => setActiveTab("posts")}
              >
                <FileText />
                <span>Community Posts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "progress"} 
                onClick={() => setActiveTab("progress")}
              >
                <PieChart />
                <span>Progress Tracker</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={activeTab === "Resume"} 
                onClick={() => setActiveTab("Resume")}
              >
                <PieChart />
                <span>Resume Analyzer</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user.fullName.firstName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.fullName.firstName + " " + user.fullName.lastName}</p>
                <p className="text-xs text-muted-foreground">{studentProfile.program}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }