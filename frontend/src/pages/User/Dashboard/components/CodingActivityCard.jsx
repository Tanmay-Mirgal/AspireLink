import React, { useState } from 'react';
import { Code2, Github, Calendar, Trophy, PlusCircle } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';



export function CodeActivityCard({ leetCodeStats, githubStats }) {
  const [activeTab, setActiveTab] = useState<"leetcode" | "github">("leetcode");

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
        {activeTab === "leetcode" ? (
          <LeetCodeContent stats={leetCodeStats} />
        ) : (
          <GitHubContent stats={githubStats} />
        )}
      </CardContent>
    </Card>
  );
}

function LeetCodeContent({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500">Problems Solved</p>
          <p className="text-2xl font-bold text-green-600">{stats.problemsSolved}</p>
          <div className="flex items-center justify-center mt-1">
            <Badge variant="secondary" className="flex items-center gap-1">
              Top 10% weekly
            </Badge>
          </div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">Day Streak</p>
          <p className="text-2xl font-bold text-blue-600">{stats.streak}</p>
          <p className="text-xs text-gray-500 mt-1">Longest: {stats.longestStreak} days</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-500">Points</p>
          <p className="text-2xl font-bold text-purple-600">{stats.points}</p>
          <p className="text-xs text-gray-500 mt-1">Level: {stats.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h4 className="font-medium mb-3">Problem Breakdown</h4>
          <div className="space-y-3">
            <ProblemCategoryCard category="Easy" count={58} total={126} color="bg-green-500" />
            <ProblemCategoryCard category="Medium" count={54} total={126} color="bg-orange-500" />
            <ProblemCategoryCard category="Hard" count={14} total={126} color="bg-red-500" />
          </div>
        </div>
        
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

      <div>
        <h4 className="font-medium mb-3">Recently Solved Problems</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.recentProblems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GitHubContent({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">Contributions</p>
          <p className="text-2xl font-bold text-blue-600">{stats.contributions}</p>
          <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-500">Repositories</p>
          <p className="text-2xl font-bold text-purple-600">{stats.repositories}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.activeRepos} active this month</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-500">Pull Requests</p>
          <p className="text-2xl font-bold text-green-600">{stats.pullRequests}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.openPRs} open</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Top Repositories</h4>
            <Button variant="ghost" size="sm" className="flex items-center h-7 px-2">
              <PlusCircle className="mr-1 h-3 w-3" />
              <span className="text-xs">Connect</span>
            </Button>
          </div>
          <div className="space-y-3">
            <TopRepositoryCard name="student-dashboard" stars={12} language="JavaScript" />
            <TopRepositoryCard name="interview-prep" stars={8} language="Python" />
            <TopRepositoryCard name="portfolio-site" stars={5} language="HTML/CSS" />
          </div>
        </div>
        
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
    </div>
  );
}

function ProblemCard({ title, difficulty, category, solvedDate, runtime, memory }) {
  const difficultyColors = {
    "Easy": "text-green-500",
    "Medium": "text-orange-500",
    "Hard": "text-red-500"
  };
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h5 className="font-medium line-clamp-1">{title}</h5>
        <Badge variant="outline" className={difficultyColors[difficulty]}>
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
  );
}

function ProblemCategoryCard({ category, count, total, color }) {
  const percentage = Math.round((count / total) * 100);
  
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
  );
}

function TopRepositoryCard({ name, stars, language }) {
  const languageColors = {
    "JavaScript": "bg-yellow-400",
    "Python": "bg-blue-500",
    "HTML/CSS": "bg-orange-500",
    "Java": "bg-red-500",
    "C++": "bg-purple-500"
  };
  
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
  );
}

function HorizontalHeatmap({ colorType }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const sixMonthsAgo = subDays(today, 182);
  
  const getColor = (value, type) => {
    if (type === "leetcode") {
      return [
        "bg-gray-100",
        "bg-green-100",
        "bg-green-200",
        "bg-green-300",
        "bg-green-500"
      ][value] || "bg-gray-100";
    }
    return [
      "bg-gray-100",
      "bg-blue-100",
      "bg-blue-200",
      "bg-blue-300",
      "bg-blue-500"
    ][value] || "bg-gray-100";
  };

  const generateIntensity = (dayIndex, weekIndex) => {
    const isWeekend = dayIndex >= 5;
    const isRecentWeek = weekIndex > 20;
    
    if (isWeekend) {
      return Math.floor(Math.random() * 2);
    }
    if (isRecentWeek) {
      return Math.floor(Math.random() * 5);
    }
    if (weekIndex % 4 === 0 && dayIndex < 5) {
      return Math.min(4, 2 + Math.floor(Math.random() * 3));
    }
    return Math.floor(Math.random() * 5);
  };

  return (
    <TooltipProvider>
      <div className="border rounded-lg p-4 bg-white">
        <div className="relative overflow-x-auto">
          <div className="flex text-xs text-gray-400 mb-1 pl-9">
            {Array.from({ length: 6 }).map((_, i) => {
              const date = new Date(today);
              date.setMonth(date.getMonth() - 5 + i);
              return (
                <div key={i} className="flex-1 text-center">
                  {format(date, 'MMM')}
                </div>
              );
            })}
          </div>
          
          <div className="grid grid-rows-7 gap-1">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className="flex items-center">
                <div className="w-8 text-xs text-gray-400">{day}</div>
                <div className="flex-1 grid grid-cols-26 gap-1">
                  {Array.from({ length: 26 }).map((_, weekIndex) => {
                    const intensity = generateIntensity(dayIndex, weekIndex);
                    const date = subDays(today, (26 - weekIndex) * 7 + (6 - dayIndex));
                    
                    return (
                      <Tooltip key={`${dayIndex}-${weekIndex}`}>
                        <TooltipTrigger>
                          <div 
                            className={`w-3 h-3 rounded-sm ${getColor(intensity, colorType)} transition-transform hover:scale-150 hover:shadow-md`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {format(date, 'MMM d, yyyy')}: {intensity} {colorType === "leetcode" ? "problems" : "contributions"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}