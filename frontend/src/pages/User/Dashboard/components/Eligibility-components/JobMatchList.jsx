import React from 'react';

const JobMatchList = ({ jobsWithEligibility, checkJobEligibility, getEligibilityColorClass }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Available Job Opportunities</h2>
      
      {jobsWithEligibility.length === 0 ? (
        <p className="text-gray-600">No job opportunities found.</p>
      ) : (
        <div className="space-y-4">
          {jobsWithEligibility.map(item => (
            <div key={item.job._id} className="border rounded p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{item.job.jobTitle}</h3>
                  <p className="text-gray-600">{item.job.companyName} • {item.job.jobLocation}</p>
                  <p className="text-gray-600 text-sm">{item.job.type}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.job.skillsRequired.slice(0, 5).map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {item.job.skillsRequired.length > 5 && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        +{item.job.skillsRequired.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getEligibilityColorClass(item.matchPercentage)}`}>
                    {item.matchPercentage.toFixed(1)}% Match
                  </div>
                  <div className="text-sm text-gray-600">{item.eligibilityLevel} Eligibility</div>
                  
                  <button
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                    onClick={() => checkJobEligibility(item.job._id)}
                  >
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatchList;