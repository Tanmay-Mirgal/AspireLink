import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell
} from 'recharts';

const EligibilityOverview = ({ eligibilityStats, jobsWithEligibility }) => {
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Get formatted radar data for skills comparison
  const getSkillsRadarData = () => {
    if (!eligibilityStats) return [];
    
    return eligibilityStats.skillStats.map(stat => ({
      subject: stat.skill,
      proficiency: stat.proficiency,
      marketDemand: Math.min(10, (stat.jobPercentage / 10))
    }));
  };
  
  // Get market demand data for bar chart
  const getMarketDemandData = () => {
    if (!eligibilityStats) return [];
    return eligibilityStats.marketDemand.slice(0, 10);
  };
  
  // Get pie data for job eligibility levels
  const getEligibilityDistributionData = () => {
    if (!jobsWithEligibility.length) return [];
    
    const counts = jobsWithEligibility.reduce((acc, job) => {
      const level = job.eligibilityLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar Chart */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Skills vs Market Demand</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={getSkillsRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="Your Proficiency" dataKey="proficiency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Market Demand" dataKey="marketDemand" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            This radar chart compares your skill proficiency levels with market demand. 
            Higher market demand suggests skills that are more valuable to employers.
          </p>
        </div>
        
        {/* Market Demand Bar Chart */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top 10 Skills in Demand</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMarketDemandData()} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="skill" width={100} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Job Demand']} />
                <Legend />
                <Bar dataKey="percentage" name="% of Jobs Requiring" fill={({ hasSkill }) => hasSkill ? '#82ca9d' : '#8884d8'}>
                  {getMarketDemandData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hasSkill ? '#82ca9d' : '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex mt-4 text-sm">
            <div className="flex items-center mr-6">
              <div className="w-3 h-3 bg-green-500 mr-2"></div>
              <span className="text-gray-600">Skills you have</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 mr-2"></div>
              <span className="text-gray-600">Skills you need</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Eligibility Distribution */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Job Eligibility Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex items-center justify-center">
            <div className="h-64 w-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getEligibilityDistributionData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getEligibilityDistributionData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <h3 className="font-medium text-green-800">High Eligibility</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {jobsWithEligibility.filter(job => job.eligibilityLevel === 'High').length}
                  </p>
                  <p className="text-sm text-green-700">Jobs with 80%+ match</p>
                </div>
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <h3 className="font-medium text-blue-800">Good Eligibility</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {jobsWithEligibility.filter(job => job.eligibilityLevel === 'Good').length}
                  </p>
                  <p className="text-sm text-blue-700">Jobs with 60-79% match</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                  <h3 className="font-medium text-yellow-800">Moderate Eligibility</h3>
                  <p className="text-3xl font-bold text-yellow-600">
                    {jobsWithEligibility.filter(job => job.eligibilityLevel === 'Moderate').length}
                  </p>
                  <p className="text-sm text-yellow-700">Jobs with 40-59% match</p>
                </div>
                <div className="bg-red-50 p-4 rounded border border-red-200">
                  <h3 className="font-medium text-red-800">Low Eligibility</h3>
                  <p className="text-3xl font-bold text-red-600">
                    {jobsWithEligibility.filter(job => job.eligibilityLevel === 'Low').length}
                  </p>
                  <p className="text-sm text-red-700">Jobs with &lt;40% match</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                This distribution shows how your skills match with available job opportunities. 
                Click on "Job Matches" to see detailed information about each job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityOverview;