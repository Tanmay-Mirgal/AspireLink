import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const JobReport = ({ jobReport, selectedJob, getEligibilityColorClass }) => {
  // Get matched vs missing skills data for selected job
  const getSkillsComparisonData = () => {
    if (!jobReport) return [];
    
    return [
      { name: 'Matched Skills', value: jobReport.matchedSkills.length },
      { name: 'Missing Skills', value: jobReport.missingSkills.length }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Job Overview */}
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedJob.jobTitle}</h2>
            <p className="text-gray-600 text-lg">{selectedJob.companyName} • {selectedJob.jobLocation}</p>
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{selectedJob.type}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${getEligibilityColorClass(jobReport.matchPercentage)}`}>
              {jobReport.matchPercentage.toFixed(1)}% Match
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">Job Description</h3>
          <p className="text-gray-700">{selectedJob.jobDescription}</p>
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {selectedJob.skillsRequired.map((skill, index) => (
              <span 
                key={index} 
                className={`text-sm px-3 py-1 rounded-full ${
                  jobReport.matchedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Eligibility Report Card */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Eligibility Analysis</h2>
        
        <div className="p-4 mb-6 rounded" style={{ backgroundColor: 'rgba(247, 250, 255, 0.8)' }}>
          <p className="text-lg">{jobReport.reportText}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skills Comparison */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Skills Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getSkillsComparisonData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#F44336" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Your Strengths */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Your Strengths</h3>
            {jobReport.topSkills.length > 0 ? (
              <div className="space-y-2">
                {jobReport.topSkills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div
                        className="bg-blue-600 h-5 rounded-full"
                        style={{ width: `${skill.proficiency * 10}%` }}
                      ></div>
                    </div>
                    <div className="ml-2 min-w-[100px]">
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills data available.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {jobReport.missingSkills.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Skill Development Recommendations</h2>
          
          <div className="space-y-6">
            {jobReport.recommendations.map((rec, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-lg text-gray-800 mb-2">{rec.skill}</h3>
                <p className="text-gray-600 mb-3">
                  Developing this skill would significantly improve your eligibility for this position
                  and similar roles in the industry.
                </p>
                
                <h4 className="font-medium text-gray-700 mb-2">Learning Resources:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {rec.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 bg-blue-50 hover:bg-blue-100 rounded"
                    >
                      <span className="text-blue-700">{resource.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobReport;