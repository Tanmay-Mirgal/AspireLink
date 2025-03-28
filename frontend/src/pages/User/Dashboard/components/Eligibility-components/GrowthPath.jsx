import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const GrowthPath = ({ eligibilityStats }) => {
  // Get skill growth opportunity data for line chart
  const getSkillGrowthData = () => {
    if (!eligibilityStats || !eligibilityStats.skillStats) return [];
    
    // Sort skills by job percentage (market demand) in descending order
    const sortedSkills = [...eligibilityStats.skillStats]
      .sort((a, b) => b.jobPercentage - a.jobPercentage)
      .slice(0, 5);  // Top 5 skills
    
    // Create data points for potential growth trajectory
    return sortedSkills.map(skill => {
      const currentProficiency = skill.proficiency;
      const potentialGrowth = Math.min(10, currentProficiency + 3);  // Capped at 10
      
      return {
        name: skill.skill,
        current: currentProficiency,
        potential: potentialGrowth,
        jobDemand: Math.min(10, skill.jobPercentage / 10)
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Skills Growth Trajectory */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Skills Growth Trajectory</h2>
        <p className="text-gray-600 mb-6">
          This chart visualizes your potential growth path for high-demand skills. 
          Focusing on these skills will maximize your job eligibility.
        </p>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getSkillGrowthData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} label={{ value: 'Proficiency Level', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="current" name="Current Proficiency" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="potential" name="Potential Growth" stroke="#82ca9d" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="jobDemand" name="Market Demand" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Growth Recommendations */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Personalized Growth Plan</h2>
        
        <div className="space-y-6">
          {getSkillGrowthData().map((skillData, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg text-gray-800">{skillData.name}</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Priority:</span>
                  <div className="flex">
                    {Array.from({ length: Math.ceil(skillData.jobDemand) }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                    ))}
                    {Array.from({ length: 10 - Math.ceil(skillData.jobDemand) }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-800 mb-1">Current Level</div>
                  <div className="text-2xl font-bold text-blue-600">{skillData.current}/10</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-sm text-green-800 mb-1">Target Level</div>
                  <div className="text-2xl font-bold text-green-600">{skillData.potential}/10</div>
                </div>
                <div className="bg-amber-50 p-3 rounded">
                  <div className="text-sm text-amber-800 mb-1">Market Demand</div>
                  <div className="text-2xl font-bold text-amber-600">{(skillData.jobDemand * 10).toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Recommended Learning Path:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Complete foundational courses in {skillData.name}</li>
                  <li>Build a portfolio project showcasing your {skillData.name} skills</li>
                  <li>Join communities related to {skillData.name} for networking</li>
                  <li>Contribute to open-source projects using {skillData.name}</li>
                </ol>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Estimated Timeline:</h4>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full text-xs text-white text-center py-0.5"
                      style={{ width: `${(skillData.potential - skillData.current) * 25}%` }}
                    >
                      {skillData.potential - skillData.current <= 2 ? "2-3 months" : 
                       skillData.potential - skillData.current <= 4 ? "4-6 months" : "6-12 months"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mentor Recommendations */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mentor Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Based on your skill gaps and career goals, connecting with the following mentors 
          could significantly accelerate your growth.
        </p>
        
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="border rounded p-4 flex items-start">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">Mentor {idx}</h3>
                <p className="text-gray-600 text-sm">Senior Developer at Top Tech Co.</p>
                <p className="text-gray-600 text-sm mt-2">
                  Skills: React, Node.js, AWS, System Design
                </p>
                <div className="mt-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">
                    Request Mentorship
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrowthPath;