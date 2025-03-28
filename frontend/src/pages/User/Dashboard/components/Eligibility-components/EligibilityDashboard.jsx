import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EligibilityOverview from './EligibilityOverview';
import JobMatchList from './JobMatchList';
import JobReport from './JobReport';
import GrowthPath from './GrowthPath';
import { axiosInstance } from '@/lib/axios';

const EligibilityDashboard = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [eligibilityStats, setEligibilityStats] = useState(null);
  const [jobsWithEligibility, setJobsWithEligibility] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobReport, setJobReport] = useState(null);
  
  // Fetch user ID from localStorage or context on component mount
  useEffect(() => {
    // For demo purposes, you might want to replace this with your actual auth implementation
    const user = JSON.parse(localStorage.getItem('user')) ;
    const storedUserId = user ? user._id : null;
    setUserId(storedUserId);
    
    if (storedUserId) {
      fetchEligibilityStats(storedUserId);
      fetchJobsWithEligibility(storedUserId);
    }
  }, []);
  
  // Fetch eligibility statistics
  const fetchEligibilityStats = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get(`/eligibility/statistics/`);
      setEligibilityStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch eligibility statistics');
      console.error('Error fetching eligibility statistics:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch jobs with eligibility
  const fetchJobsWithEligibility = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get(`/eligibility/jobs/`);
      setJobsWithEligibility(response.data.jobsWithEligibility || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs with eligibility');
      console.error('Error fetching jobs with eligibility:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Check eligibility for a specific job
  const checkJobEligibility = async (jobId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get(`/eligibility/check/${jobId}`);
      setJobReport(response.data.eligibilityReport);
      setSelectedJob(jobsWithEligibility.find(item => item.job._id === jobId)?.job || null);
      setActiveTab('jobReport');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check job eligibility');
      console.error('Error checking job eligibility:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Get eligibility color class based on percentage
  const getEligibilityColorClass = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-500';
    if (percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Render loading state
  if (loading && !eligibilityStats && !jobsWithEligibility.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-600">Loading eligibility data...</div>
      </div>
    );
  }
  
  // Render error state
  if (error && !eligibilityStats && !jobsWithEligibility.length) {
    return (
      <div className="bg-red-50 p-4 rounded border border-red-300">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Eligibility Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job Matches
        </button>
        {jobReport && (
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'jobReport' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('jobReport')}
          >
            Job Report
          </button>
        )}
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'growth' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('growth')}
        >
          Growth Path
        </button>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && eligibilityStats && (
        <EligibilityOverview 
          eligibilityStats={eligibilityStats} 
          jobsWithEligibility={jobsWithEligibility} 
        />
      )}
      
      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <JobMatchList 
          jobsWithEligibility={jobsWithEligibility} 
          checkJobEligibility={checkJobEligibility}
          getEligibilityColorClass={getEligibilityColorClass}
        />
      )}
      
      {/* Job Report Tab */}
      {activeTab === 'jobReport' && jobReport && selectedJob && (
        <JobReport 
          jobReport={jobReport} 
          selectedJob={selectedJob}
          getEligibilityColorClass={getEligibilityColorClass}
        />
      )}
      
      {/* Growth Path Tab */}
      {activeTab === 'growth' && eligibilityStats && (
        <GrowthPath eligibilityStats={eligibilityStats} />
      )}
    </div>
  );
};

export default EligibilityDashboard;