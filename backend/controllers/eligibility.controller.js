
import natural from "natural";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

// NLP initialization
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const stemmer = natural.PorterStemmer;

const calculateSkillSimilarity = (studentSkills, jobSkills) => {
  // Normalize and stem the skills
  const normalizeSkill = (skill) => stemmer.stem(skill.toLowerCase());
  
  // Transform skills arrays into normalized/stemmed versions
  const normalizedStudentSkills = studentSkills.map(skill => normalizeSkill(skill.name));
  const normalizedJobSkills = jobSkills.map(skill => normalizeSkill(skill));
  
  // Calculate Jaccard similarity
  const intersection = normalizedStudentSkills.filter(skill => 
    normalizedJobSkills.some(jobSkill => jobSkill === skill)
  );
  
  const union = [...new Set([...normalizedStudentSkills, ...normalizedJobSkills])];
  
  // Calculate the percentage match
  const matchPercentage = (intersection.length / union.length) * 100;
  
  // Find skills that match
  const matchedSkills = studentSkills.filter(skill => 
    normalizedJobSkills.some(jobSkill => normalizeSkill(skill.name) === jobSkill)
  );
  
  // Find skills that are missing
  const missingSkills = jobSkills.filter(skill => 
    !normalizedStudentSkills.some(studentSkill => studentSkill === normalizeSkill(skill))
  );
  
  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
};

const generateEligibilityReport = (matchData, studentSkills, job) => {
  // Sort student skills by proficiency
  const sortedSkills = [...studentSkills].sort((a, b) => b.proficiency - a.proficiency);
  const topSkills = sortedSkills.slice(0, 3);
  const weakSkills = sortedSkills.slice(-3);
  
  let recommendations = [];
  
  // Generate recommendations based on missing skills
  matchData.missingSkills.forEach(skill => {
    recommendations.push({
      skill: skill,
      resources: [
        { name: "Coursera", url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}` },
        { name: "Udemy", url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}` },
        { name: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+tutorial` }
      ]
    });
  });
  
  // Generate report text using NLP-like approach
  let reportText = "";
  
  if (matchData.matchPercentage >= 80) {
    reportText = `You are highly eligible for this ${job.jobTitle} position at ${job.companyName}. Your skills align well with the job requirements, with a ${matchData.matchPercentage.toFixed(1)}% match.`;
  } else if (matchData.matchPercentage >= 60) {
    reportText = `You have good potential for this ${job.jobTitle} position at ${job.companyName}, with a ${matchData.matchPercentage.toFixed(1)}% skill match. Focusing on the missing skills would significantly improve your chances.`;
  } else if (matchData.matchPercentage >= 40) {
    reportText = `You have moderate eligibility for this ${job.jobTitle} position at ${job.companyName}, with a ${matchData.matchPercentage.toFixed(1)}% skill match. Consider developing the missing skills to increase your chances.`;
  } else {
    reportText = `Your current skill set shows limited alignment (${matchData.matchPercentage.toFixed(1)}%) with this ${job.jobTitle} position at ${job.companyName}. We recommend focusing on the missing skills to become eligible.`;
  }
  
  return {
    reportText,
    matchPercentage: matchData.matchPercentage,
    matchedSkills: matchData.matchedSkills,
    missingSkills: matchData.missingSkills,
    topSkills,
    weakSkills,
    recommendations
  };
};

export const checkJobEligibility = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id
    
    // Fetch user and job data
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);
    
    if (!user || !job) {
      return res.status(404).json({ 
        success: false, 
        message: !user ? "User not found" : "Job not found" 
      });
    }
    
    // Extract student skills and job required skills
    const studentSkills = user.studentProfile.skills || [];
    const jobSkills = job.skillsRequired || [];
    
    if (studentSkills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Student has no skills listed in their profile" 
      });
    }
    
    // Calculate skill match
    const matchData = calculateSkillSimilarity(studentSkills, jobSkills);
    
    // Generate the eligibility report
    const eligibilityReport = generateEligibilityReport(matchData, studentSkills, job);
    
    return res.status(200).json({
      success: true,
      eligibilityReport
    });
  } catch (error) {
    console.error("Error in checkJobEligibility:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking job eligibility",
      error: error.message
    });
  }
};

export const getAllJobsWithEligibility = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch user data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Extract student skills
    const studentSkills = user.studentProfile.skills || [];
    
    if (studentSkills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Student has no skills listed in their profile" 
      });
    }
    
    // Fetch all jobs
    const jobs = await Job.find({});
    
    // Calculate eligibility for each job
    const jobsWithEligibility = jobs.map(job => {
      const matchData = calculateSkillSimilarity(studentSkills, job.skillsRequired);
      
      return {
        job,
        matchPercentage: matchData.matchPercentage,
        eligibilityLevel: matchData.matchPercentage >= 80 ? "High" : 
                         matchData.matchPercentage >= 60 ? "Good" :
                         matchData.matchPercentage >= 40 ? "Moderate" : "Low"
      };
    });
    
    // Sort jobs by eligibility (highest first)
    jobsWithEligibility.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return res.status(200).json({
      success: true,
      jobsWithEligibility
    });
  } catch (error) {
    console.error("Error in getAllJobsWithEligibility:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching jobs with eligibility",
      error: error.message
    });
  }
};

export const getEligibilityStatistics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch user data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Extract student skills
    const studentSkills = user.studentProfile.skills || [];
    
    if (studentSkills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Student has no skills listed in their profile" 
      });
    }
    
    // Fetch all jobs
    const jobs = await Job.find({});
    
    // Calculate statistics
    const skillStats = studentSkills.map(skill => {
      // Count jobs requiring this skill
      const jobsRequiringSkill = jobs.filter(job => 
        job.skillsRequired.some(jobSkill => 
          stemmer.stem(jobSkill.toLowerCase()) === stemmer.stem(skill.name.toLowerCase())
        )
      );
      
      return {
        skill: skill.name,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience,
        jobsRequiring: jobsRequiringSkill.length,
        jobPercentage: (jobsRequiringSkill.length / jobs.length) * 100
      };
    });
    
    // Get market demand (most requested skills across all jobs)
    const allJobSkills = jobs.flatMap(job => job.skillsRequired);
    const skillFrequency = {};
    
    allJobSkills.forEach(skill => {
      const normalizedSkill = skill.toLowerCase();
      skillFrequency[normalizedSkill] = (skillFrequency[normalizedSkill] || 0) + 1;
    });
    
    const marketDemand = Object.entries(skillFrequency)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: (count / jobs.length) * 100,
        hasSkill: studentSkills.some(studentSkill => 
          studentSkill.name.toLowerCase() === skill.toLowerCase()
        )
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return res.status(200).json({
      success: true,
      skillStats,
      marketDemand,
      totalJobs: jobs.length
    });
  } catch (error) {
    console.error("Error in getEligibilityStatistics:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching eligibility statistics",
      error: error.message
    });
  }
};