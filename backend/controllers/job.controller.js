 // Assuming you have a User model

import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Create a new job posting (for mentors)
export const createJob = async (req, res) => {
  try {
    const { companyName, type, jobDescription, skillsRequired, jobLocation, jobTitle } = req.body;
    
    const mentorId = req.user.id; 
    const mentor = await User.findById(mentorId);
    
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can create job postings" });
    }
    
    const newJob = new Job({
      companyName,
      type,
      mentorId,
      jobDescription,
      skillsRequired,
      jobLocation,
      jobTitle,
      appliedStudents: [] 
    });
    
    await newJob.save();
    
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob
    });
    
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job posting",
      error: error.message
    });
  }
};

// Get all job postings
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('mentorId', 'name email');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job postings",
      error: error.message
    });
  }
};

// Get a specific job by ID
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId)
      .populate('mentorId', 'name email')
      .populate('appliedStudents', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    res.status(200).json({
      success: true,
      job
    });
    
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
      error: error.message
    });
  }
};

// Update a job posting (for mentors)
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;
    const mentorId = req.user._id; // From auth middleware
    
    // Check if job exists and belongs to this mentor
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    if (job.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own job postings"
      });
    }
    
    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updates,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Job posting updated successfully",
      job: updatedJob
    });
    
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job posting",
      error: error.message
    });
  }
};

// Delete a job posting (for mentors)
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const mentorId = req.user._id; // From auth middleware
    
    // Check if job exists and belongs to this mentor
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    if (job.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own job postings"
      });
    }
    
    await Job.findByIdAndDelete(jobId);
    
    res.status(200).json({
      success: true,
      message: "Job posting deleted successfully"
    });
    
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job posting",
      error: error.message
    });
  }
};

// Apply for a job (for students)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user._id; // From auth middleware
    
    // Validate that the user is a student
    const student = await User.findById(studentId);
    
    if (!student || student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can apply for jobs"
      });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    // Check if student has already applied
    if (job.appliedStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job"
      });
    }
    
    // Add student to applied students
    job.appliedStudents.push(studentId);
    await job.save();
    
    res.status(200).json({
      success: true,
      message: "Applied for job successfully"
    });
    
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: error.message
    });
  }
};

// Get all applications for a job (for mentors)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const mentorId = req.user._id; // From auth middleware
    
    // Check if job exists and belongs to this mentor
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }
    
    if (job.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "You can only view applications for your own job postings"
      });
    }
    
    // Get detailed information about applicants
    const jobWithApplicants = await Job.findById(jobId)
      .populate('appliedStudents', 'name email profile'); // Assuming User model has these fields
    
    res.status(200).json({
      success: true,
      applicantsCount: jobWithApplicants.appliedStudents.length,
      applicants: jobWithApplicants.appliedStudents
    });
    
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job applications",
      error: error.message
    });
  }
};

// Get jobs posted by a mentor
export const getMentorJobs = async (req, res) => {
  try {
      console.log(req.user._id)
    const mentorId = req.user._id; // From auth middleware
    const jobs = await Job.find({ mentorId });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
    
  } catch (error) {
    console.error("Error fetching mentor jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor jobs",
      error: error.message
    });
  }
};

// Get jobs a student has applied for
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user._id; // From auth middleware
    
    const jobs = await Job.find({ appliedStudents: studentId })
      .populate('mentorId', 'name email');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      applications: jobs
    });
    
  } catch (error) {
    console.error("Error fetching student applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student applications",
      error: error.message
    });
  }
};