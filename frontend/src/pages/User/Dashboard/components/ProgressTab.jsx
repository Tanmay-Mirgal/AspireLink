import { useState } from "react"
import { CheckCircle, Clock, Award, Github, Code2, Calendar, Trophy, PlusCircle, BookOpen, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts"

export function ProgressTab({ studentProfile, progressData }) {
    const user = JSON.parse(localStorage.getItem('user'))
  return (
    <>
      <LearningProgressCard studentProfile={studentProfile} user={user} progressData={progressData} />
      <ModulesCompletionCard progressData={progressData} />
      {/* <CodingActivityCard /> */}
      <EarnedBadgesCard studentProfile={studentProfile} user={user} />
    </>
  )
}

// Learning Progress Card Component
function LearningProgressCard({ studentProfile, progressData,user }) {
  // Calculate stats for the donut chart
  const completedModules = progressData.filter(module => module.completed).length;
  const inProgressModules = progressData.filter(module => !module.completed).length;
  const totalModules = progressData.length;
  
  const data = [
    { name: "Completed", value: completedModules, color: "#22c55e" },
    { name: "In Progress", value: inProgressModules, color: "#eab308" },
    { name: "Not Started", value: 0, color: "#e2e8f0" }
  ];

  // Calculate average score
  const averageScore = progressData
    .filter(module => module.completed)
    .reduce((sum, module) => sum + module.score, 0) / completedModules || 0;

  // Prepare data for the line chart
  const completionData = progressData.map((module, index) => ({
    name: `Module ${index + 1}`,
    module: module.module,
    progress: module.completed ? 100 : module.progress || 0,
    score: module.completed ? module.score : 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Track your progress through the curriculum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} Modules`, name]}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <p className="text-lg font-semibold">Overall Completion</p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Completed ({completedModules})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">In Progress ({inProgressModules})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Progress Line */}
          <div className="col-span-2">
            <div className="flex justify-between mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Completion</p>
                <p className="text-2xl font-bold text-green-600">{user.studentProfile.skills[0].proficiency}%</p>
                <p className="text-xs text-gray-500">{completedModules} of {totalModules} modules</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Across completed modules</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-500">Est. Completion</p>
                <p className="text-2xl font-bold text-purple-600">Aug 2023</p>
                <p className="text-xs text-gray-500">At current pace</p>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}${name === 'progress' ? '%' : ''}`, 
                      name === 'progress' ? 'Completion' : 'Score'
                    ]}
                    labelFormatter={(value, payload) => payload[0]?.payload.module}
                    contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Module Completion Card Component
function ModulesCompletionCard({ progressData }) {
  // Prepare data for bar chart
  const moduleScores = progressData.map(module => ({
    name: module.module.split(' ')[0], // Get just the first word for shorter x-axis labels
    fullName: module.module,
    score: module.completed ? module.score : 0,
    progress: module.completed ? 100 : (module.progress || 0),
    status: module.completed ? 'Completed' : 'In Progress'
  }));

  // Custom colors for bars
  const statusColors = {
    Completed: "#22c55e",
    "In Progress": "#eab308"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Completion Status</CardTitle>
        <CardDescription>Performance across all learning modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={moduleScores}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'progress' ? 'Completion' : 'Score'
                ]}
                labelFormatter={(value, payload) => payload[0]?.payload.fullName}
                contentStyle={{ borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Bar 
                dataKey="progress" 
                name="Progress" 
                radius={[4, 4, 0, 0]}
              >
                {moduleScores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={statusColors[entry.status]} />
                ))}
              </Bar>
              <Bar 
                dataKey="score" 
                name="Score" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Coding Activity Card Component
function CodingActivityCard() {
  const [activeTab, setActiveTab] = useState("leetcode")

  return (
    <Card className="mt-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Coding Activity</CardTitle>
            <CardDescription>Your LeetCode and GitHub contributions</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === "leetcode" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveTab("leetcode")}
              className="flex items-center"
            >
              <Code2 className="mr-2 h-4 w-4" />
              LeetCode
            </Button>
            <Button 
              variant={activeTab === "github" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveTab("github")}
              className="flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 6 Months
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "leetcode" ? <LeetCodeContent /> : <GitHubContent />}
      </CardContent>
    </Card>
  )
}

// LeetCode Content Component
function LeetCodeContent() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500">Problems Solved</p>
          <p className="text-2xl font-bold text-green-600">126</p>
          <div className="flex items-center justify-center mt-1">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              Top 10% weekly
            </Badge>
          </div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">Day Streak</p>
          <p className="text-2xl font-bold text-blue-600">62</p>
          <p className="text-xs text-gray-500 mt-1">Longest: 78 days</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-500">Points</p>
          <p className="text-2xl font-bold text-purple-600">1,842</p>
          <p className="text-xs text-gray-500 mt-1">Level: Advanced</p>
        </div>
      </div>
      
      {/* Heatmap and breakdown in horizontal layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem categories */}
        <div>
          <h4 className="font-medium mb-3">Problem Breakdown</h4>
          <div className="space-y-3">
            <ProblemCategoryCard category="Easy" count={58} total={126} color="bg-green-500" />
            <ProblemCategoryCard category="Medium" count={54} total={126} color="bg-orange-500" />
            <ProblemCategoryCard category="Hard" count={14} total={126} color="bg-red-500" />
          </div>
        </div>
        
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Activity Heatmap</h4>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Less</div>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              </div>
              <div className="text-xs text-muted-foreground">More</div>
            </div>
          </div>
          
          <HorizontalHeatmap colorType="leetcode" />
        </div>
      </div>
      
      {/* Recent problems section */}
      <div>
        <h4 className="font-medium mb-3">Recently Solved Problems</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <LeetCodeProblemCard 
            title="Two Sum" 
            difficulty="Easy"
            category="Arrays & Hashing"
            solvedDate="Today"
            runtime="92ms"
            memory="42.1 MB"
          />
          <LeetCodeProblemCard 
            title="Valid Parentheses" 
            difficulty="Easy"
            category="Stack"
            solvedDate="Yesterday"
            runtime="76ms"
            memory="40.2 MB"
          />
          <LeetCodeProblemCard 
            title="Longest Substring Without Repeating Characters" 
            difficulty="Medium"
            category="Sliding Window"
            solvedDate="3 days ago"
            runtime="105ms"
            memory="45.7 MB"
          />
        </div>
      </div>
    </div>
  )
}

// GitHub Content Component
function GitHubContent() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">Contributions</p>
          <p className="text-2xl font-bold text-blue-600">432</p>
          <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-500">Repositories</p>
          <p className="text-2xl font-bold text-purple-600">16</p>
          <p className="text-xs text-gray-500 mt-1">5 active this month</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500">Pull Requests</p>
          <p className="text-2xl font-bold text-green-600">42</p>
          <p className="text-xs text-gray-500 mt-1">8 open</p>
        </div>
      </div>
      
      {/* Heatmap and repos in horizontal layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top repositories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Top Repositories</h4>
            <Button variant="ghost" size="sm" className="flex items-center h-7 px-2">
              <PlusCircle className="mr-1 h-3 w-3" />
              <span className="text-xs">Connect</span>
            </Button>
          </div>
          <div className="space-y-3">
            <TopRepositoryCard 
              name="student-dashboard" 
              stars={12}
              language="JavaScript"
            />
            <TopRepositoryCard 
              name="interview-prep" 
              stars={8}
              language="Python"
            />
            <TopRepositoryCard 
              name="portfolio-site" 
              stars={5}
              language="HTML/CSS"
            />
          </div>
        </div>
        
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Contribution Activity</h4>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Less</div>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              </div>
              <div className="text-xs text-muted-foreground">More</div>
            </div>
          </div>
          
          <HorizontalHeatmap colorType="github" />
        </div>
      </div>
      
      {/* Recent repositories section */}
      <div>
        <h4 className="font-medium mb-3">Recent Activity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <RepositoryCard 
            name="student-dashboard" 
            description="React dashboard for students"
            language="JavaScript"
            stars={12}
            forks={3}
            lastUpdate="2 days ago"
          />
          <RepositoryCard 
            name="interview-prep" 
            description="LeetCode solutions and notes"
            language="Python"
            stars={8}
            forks={1}
            lastUpdate="1 week ago"
          />
          <RepositoryCard 
            name="portfolio-site" 
            description="Personal portfolio website"
            language="HTML/CSS"
            stars={5}
            forks={0}
            lastUpdate="3 weeks ago"
          />
        </div>
      </div>
    </div>
  )
}

// Horizontal Heatmap Component
function HorizontalHeatmap({ colorType = "leetcode" }) {
  // Generate sample data for a horizontal timeline layout
  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="relative overflow-x-auto">
        <div className="flex text-xs text-gray-400 mb-1 pl-9">
          {months.map((month, i) => (
            <div key={i} className="flex-1 text-center">{month}</div>
          ))}
        </div>
        
        <div className="grid grid-rows-7 gap-1">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="flex items-center">
              <div className="w-8 text-xs text-gray-400">{day}</div>
              <div className="flex-1 grid grid-cols-26 gap-1">
                {Array.from({ length: 26 }).map((_, weekIndex) => {
                  // Generate intensity values with patterns
                  const isWeekend = dayIndex >= 5;
                  const isRecentWeek = weekIndex > 20;
                  
                  let intensity = 0;
                  
                  if (isWeekend) {
                    intensity = Math.floor(Math.random() * 2); // Lower activity on weekends
                  } else if (isRecentWeek) {
                    intensity = Math.floor(Math.random() * 5); // More activity recently
                  } else if (weekIndex % 4 === 0 && dayIndex < 5) {
                    intensity = Math.min(4, 2 + Math.floor(Math.random() * 3)); // Create some patterns
                  } else {
                    intensity = Math.floor(Math.random() * 5);
                  }
                  
                  return (
                    <div 
                      key={`${dayIndex}-${weekIndex}`}
                      className={`w-3 h-3 rounded-sm ${
                        colorType === "leetcode" 
                          ? getLeetCodeColor(intensity) 
                          : getGitHubColor(intensity)
                      } transition-transform hover:scale-150 hover:shadow-md`}
                      title={`${intensity} ${colorType === "leetcode" ? "problems" : "contributions"}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Problem Category Card Component
function ProblemCategoryCard({ category, count, total, color }) {
  const percentage = Math.round((count / total) * 100)
  
  return (
    <div className="border rounded-lg p-3 flex items-center">
      <div className={`${color} w-3 h-3 rounded-sm mr-3`}></div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h5 className="font-medium">{category}</h5>
          <span className="text-sm text-muted-foreground">{count}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
          <div 
            className={`h-full rounded-full ${color}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

// Top Repository Card Component
function TopRepositoryCard({ name, stars, language }) {
  const languageColors = {
    "JavaScript": "bg-yellow-400",
    "Python": "bg-blue-500",
    "HTML/CSS": "bg-orange-500",
    "Java": "bg-red-500",
    "C++": "bg-purple-500"
  }
  
  return (
    <div className="border rounded-lg p-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${languageColors[language]} bg-opacity-20`}>
          <Github className="w-4 h-4" />
        </div>
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
          <span className="text-sm">{stars}</span>
        </div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${languageColors[language]}`}></div>
        </div>
      </div>
    </div>
  )
}

// LeetCode Problem Card Component
function LeetCodeProblemCard({ title, difficulty, category, solvedDate, runtime, memory }) {
  const difficultyColors = {
    "Easy": "text-green-500",
    "Medium": "text-orange-500",
    "Hard": "text-red-500"
  }
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h5 className="font-medium line-clamp-1">{title}</h5>
        <Badge variant="outline" className={`${difficultyColors[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{category}</p>
      
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>Solved {solvedDate}</span>
        <div className="flex gap-2">
          <span>Runtime: {runtime}</span>
          <span>Memory: {memory}</span>
        </div>
      </div>
    </div>
  )
}

// Repository Card Component
function RepositoryCard({ name, description, language, stars, forks, lastUpdate }) {
  const languageColors = {
    "JavaScript": "bg-yellow-400",
    "Python": "bg-blue-500",
    "HTML/CSS": "bg-orange-500",
    "Java": "bg-red-500",
    "C++": "bg-purple-500"
  }
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h5 className="font-medium text-blue-600">{name}</h5>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{description}</p>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${languageColors[language]} mr-1.5`}></div>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
        
        <div className="flex gap-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            {stars}
          </div>
          <div className="flex items-center">
            <Github className="h-3 w-3 mr-1" />
            {forks}
          </div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        Updated {lastUpdate}
      </div>
    </div>
  )
}

// Earned Badges Card Component
function EarnedBadgesCard() {
  const dummyBadges = [
    { name: "Profile Complete", icon: CheckCircle, color: "bg-green-500" },
    { name: "Fast Learner", icon: BookOpen, color: "bg-blue-500" },
    { name: "Team Player", icon: Users, color: "bg-purple-500" },
    { name: "Complete React Module", icon: Code2, color: "bg-yellow-400", status: "In progress" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earned Badges</CardTitle>
        <CardDescription>Achievements and recognitions from your mentors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {dummyBadges.map((badge, index) => (
            <BadgeItem 
              key={index}
              name={badge.name}
              Icon={badge.icon}
              color={badge.color}
              awardedBy="David Wilson"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Badge Item Component
function BadgeItem({ name, Icon, color, awardedBy }) {
  return (
    <div className="flex flex-col items-center text-center p-4 border rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
      <div className={`${color} p-4 rounded-full mb-3 shadow-inner`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-medium">{name}</h3>
      <p className="text-xs text-muted-foreground mt-1">Awarded by {awardedBy}</p>
    </div>
  )
}

// In Progress Badge Item Component
function InProgressBadgeItem({ name, status }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 border rounded-lg border-dashed bg-gray-50 transform transition-transform hover:scale-105">
      <div className="bg-muted p-4 rounded-full mb-3">
        <Award className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-medium">{name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{status}</p>
    </div>
  )
}

// Helper function for LeetCode heatmap colors
// Helper function for LeetCode heatmap colors
function getLeetCodeColor(value) {
    const colors = [
      "bg-gray-100", // 0 (no activity)
      "bg-green-100", // 1 problem
      "bg-green-200", // 2 problems
      "bg-green-300", // 3 problems
      "bg-green-500"  // 4+ problems
    ]
    
    return colors[Math.min(value, colors.length - 1)]
  }
  
  // Helper function for GitHub heatmap colors
  function getGitHubColor(value) {
    const colors = [
      "bg-gray-100", // 0 (no contributions)
      "bg-blue-100", // 1 contribution
      "bg-blue-200", // 2 contributions
      "bg-blue-300", // 3 contributions
      "bg-blue-400", // 4 contributions
      "bg-blue-500"  // 5+ contributions
    ]
    
    return colors[Math.min(value, colors.length - 1)]
  }
  

 