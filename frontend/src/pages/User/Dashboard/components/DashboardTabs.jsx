import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./OverviewTabs"
import { MentorsTab } from "./MentorTabs"
import { SkillsTab } from "./SkillsTab"
import { ConnectionsTab } from "./ConnectionsTab"
import { PostsTab } from "./PostsTab"
import  {ProgressTab}  from "./ProgressTab"



export function DashboardTabs({
  activeTab,
  setActiveTab,
  studentProfile,
  assignedMentors,
  skillsData,
  industrySkillsData,
  jobEligibilityData,
  progressData,
  upcomingSessions,
  communityPosts
}) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="mentors">Mentors</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab 
          studentProfile={studentProfile}
          jobEligibilityData={jobEligibilityData}
          skillsData={skillsData}
          industrySkillsData={industrySkillsData}
          upcomingSessions={upcomingSessions}
        />
      </TabsContent>

      <TabsContent value="mentors" className="space-y-6">
        <MentorsTab assignedMentors={assignedMentors} />
      </TabsContent>

      <TabsContent value="skills" className="space-y-6">
        <SkillsTab 
          skillsData={skillsData} 
          industrySkillsData={industrySkillsData} 
        />
      </TabsContent>

      <TabsContent value="connections" className="space-y-6">
        <ConnectionsTab assignedMentors={assignedMentors} />
      </TabsContent>

      <TabsContent value="posts" className="space-y-6">
        <PostsTab communityPosts={communityPosts} />
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        <ProgressTab 
          studentProfile={studentProfile} 
          progressData={progressData} 
        />
      </TabsContent>
    </Tabs>
  )
}