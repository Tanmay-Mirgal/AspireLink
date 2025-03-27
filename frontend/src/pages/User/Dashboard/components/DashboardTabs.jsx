import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./OverviewTabs"
import { MentorsTab } from "./MentorTabs"
import { SkillsTab } from "./SkillsTab"
import { ConnectionsTab } from "./ConnectionsTab"
import { PostsTab } from "./PostsTab"
import { ProgressTab } from "./ProgressTab"
import { useStudentStore } from "@/store/useStudentStore"
import ResumeAnalyzer from "./ResumeAnalyzer"

export function DashboardTabs() {
  // Get state and actions directly from the store
  const {
    activeTab,
    setActiveTab,
    studentProfile,
    assignedMentors,
    skillsData,
    industrySkillsData,
    jobEligibilityData,
  skillAnalytics,
    upcomingSessions,
    communityPosts
  } = useStudentStore()
  // dummy progress data
  const dummyProgressData = [
    { module: "HTML/CSS", completed: true, score: 90 },
    { module: "React", completed: false, progress: 60 },
    { module: "Node.js", completed: false, progress: 40 },
    { module: "UI/UX", completed: false, progress: 20 },
  ]
 return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="mentors">Mentors</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="Resume">Resume Analyzer</TabsTrigger>
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
        <MentorsTab />
      </TabsContent>

      <TabsContent value="skills" className="space-y-6">
        <SkillsTab 
          skillsData={skillsData} 
          industrySkillsData={industrySkillsData}
          skillGapAnalysis={skillAnalytics?.skillGapAnalysis} 
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
          progressData={dummyProgressData} 
        />
      </TabsContent>
      <TabsContent value="Resume" className="space-y-6">
        <ResumeAnalyzer/>
      </TabsContent>
    </Tabs>
  )
}