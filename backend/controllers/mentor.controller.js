import { User } from "../models/user.model.js";

export const acceptRequest = async (req, res) => {
    try {
      const mentorId = req.user._id;
      const { studentId } = req.body;
  
      // Validate input
      if (!studentId) {
        return res.status(400).json({
          message: "Student ID is required"
        });
      }
  
      // Find mentor and validate
      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== 'mentor') {
        return res.status(404).json({
          message: "Valid mentor not found"
        });
      }
  
      // Find student and validate
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({
          message: "Valid student not found"
        });
      }
  
      // Check if there's a pending request from this student
      const requestIndex = mentor.mentorSchema[0].requests.findIndex(
        id => id.toString() === studentId
      );
  
      if (requestIndex === -1) {
        return res.status(400).json({
          message: "No pending request from this student"
        });
      }
  
      // Remove student from mentor's requests
      mentor.mentorSchema[0].requests.splice(requestIndex, 1);
  
      // Add student to mentor's assigned students if not already assigned
      if (!mentor.mentorSchema[0].studentAssigned.includes(studentId)) {
        mentor.mentorSchema[0].studentAssigned.push(studentId);
      }
  
      // Add mentor to student's assigned mentors if not already assigned
      if (!student.studentProfile.assignedMentor.includes(mentorId)) {
        student.studentProfile.assignedMentor.push(mentorId);
      }
  
      // Remove mentor from student's requested mentors
      student.studentProfile.requestedMentor = student.studentProfile.requestedMentor.filter(
        id => id.toString() !== mentorId
      );
  
      // Save both documents
      await mentor.save();
      await student.save();
  
      return res.status(200).json({
        message: "Mentor request accepted successfully",
        mentor: {
          _id: mentor._id,
          fullName: `${mentor.fullName.firstName} ${mentor.fullName.lastName}`,
          assignedStudents: mentor.mentorSchema[0].studentAssigned.length
        },
        student: {
          _id: student._id,
          fullName: `${student.fullName.firstName} ${student.fullName.lastName}`
        }
      });
  
    } catch (error) {
      console.error("Accept request error:", error);
      return res.status(500).json({
        message: "Failed to accept request",
        error: error.message
      });
    }
};
export const getRequests = async (req, res) => {
    try {
        const mentorId = req.user._id;
        
       
        const mentor = await User.findById(mentorId).populate({
            path: 'mentorSchema.requests',
            model: 'User',
            select: 'fullName email studentProfile.skills studentProfile.education profilePic' // Select relevant fields
        });

        if (!mentor) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }

        if (mentor.role !== 'mentor') {
            return res.status(403).json({
                message: "User is not authorized as a mentor"
            });
        }

        // Extract requests from the first mentorSchema entry
        const requests = mentor.mentorSchema.length > 0 
            ? mentor.mentorSchema[0].requests 
            : [];
        
        return res.status(200).json({
            message: "Mentor requests retrieved successfully",
            requests: requests
        });
    } catch (error) {
        console.error("Get mentor requests error:", error);
        return res.status(500).json({
            message: "Failed to retrieve mentor requests",
            error: error.message
        });
    }
}
export const studentAssigned = async (req, res) => {
    try {
        const mentorId = req.user._id;
        
        // Populate studentAssigned with detailed user information
        const mentor = await User.findById(mentorId).populate({
            path: 'mentorSchema.studentAssigned',
            model: 'User',
            select: 'fullName email studentProfile.skills studentProfile.education profilePic' // Select relevant fields
        });

        if (!mentor) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }

        if (mentor.role !== 'mentor') {
            return res.status(403).json({
                message: "User is not authorized as a mentor"
            });
        }

        // Extract students from the first mentorSchema entry
        const students = mentor.mentorSchema.length > 0 
            ? mentor.mentorSchema[0].studentAssigned 
            : [];
        
        return res.status(200).json({
            message: "Assigned students retrieved successfully",
            students: students
        });
    } catch (error) {
        console.error("Error retrieving assigned students:", error);
        return res.status(500).json({
            message: "Failed to retrieve assigned students",
            error: error.message
        });
    }
}

