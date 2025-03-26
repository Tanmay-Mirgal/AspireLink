import { User } from "../models/user.model.js";

export const getAllMentors = async (req, res) => {
  try {
    const allMentors = await User.find({ role: "mentor" }).select('-password');
    res.status(200).json(allMentors);
  } catch (error) {
    console.error("Get all mentors error:", error);
    res
      .status(500)
      .json({ message: "Failed to get all mentors", error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const allStudents = await User.find({ role: "student" }).select('-password');
    res.status(200).json(allStudents);
  } catch (error) {
    console.error("Get all students error:", error);
    res
      .status(500)
      .json({ message: "Failed to get all students", error: error.message });
  }
};

export const getRegistration = async (req, res) => {
  try {
    const registration = await User.find({
      role: "student",
      "studentProfile.isProfileComplete": false,
    }).select('-password');
    res.status(200).json(registration);
  } catch (error) {
    console.error("Get registration error:", error);
    res
      .status(500)
      .json({ message: "Failed to get registration", error: error.message });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const updatedRegistration = await User.findByIdAndUpdate(
      req.params.id,
      { "studentProfile.isProfileComplete": true },
      { new: true }
    ).select('-password');
    
    if (!updatedRegistration) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error("Update registration error:", error);
    res
      .status(500)
      .json({ message: "Failed to update registration", error: error.message });
  }
};

export const assignMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    // Validate input
    if (!studentId || !mentorId) {
      return res.status(400).json({ 
        message: "Both studentId and mentorId are required" 
      });
    }

    // Find student and mentor
    const student = await User.findOne({ 
      _id: studentId, 
      role: "student" 
    });

    const mentor = await User.findOne({ 
      _id: mentorId, 
      role: "mentor" 
    });

    // Validate student and mentor exist
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if student already has a mentor
    if (student.studentProfile.assignedMentor) {
      return res.status(400).json({ 
        message: "Student already has an assigned mentor" 
      });
    }

    // Update student with assigned mentor
    student.studentProfile.assignedMentor = mentorId;
    await student.save();

    // Update mentor's studentAssigned array
    if (mentor.mentorSchema && mentor.mentorSchema.length > 0) {
      mentor.mentorSchema[0].studentAssigned.push(studentId);
      await mentor.save();
    }

    res.status(200).json({
      message: "Mentor assigned successfully",
      student: {
        id: student._id,
        name: `${student.fullName.firstName} ${student.fullName.lastName}`,
        assignedMentor: mentorId
      },
      mentor: {
        id: mentor._id,
        name: `${mentor.fullName.firstName} ${mentor.fullName.lastName}`
      }
    });
  } catch (error) {
    console.error("Assign mentor error:", error);
    res.status(500).json({ 
      message: "Failed to assign mentor", 
      error: error.message 
    });
  }
};

export const completeStudentRegistration = async (req, res) => {
  try {
    const { studentId, profileData } = req.body;

    // Find student
    const student = await User.findOne({ 
      _id: studentId, 
      role: "student" 
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update student profile
    if (profileData.skills) {
      student.studentProfile.skills = profileData.skills;
    }

    if (profileData.education) {
      student.studentProfile.education = profileData.education;
    }

    if (profileData.socialMedia) {
      student.studentProfile.socialMedia = profileData.socialMedia;
    }

    // Mark profile as complete
    student.studentProfile.isProfileComplete = true;

    // Save updated student
    await student.save();

    res.status(200).json({
      message: "Student registration completed successfully",
      student: {
        id: student._id,
        name: `${student.fullName.firstName} ${student.fullName.lastName}`,
        profileComplete: student.studentProfile.isProfileComplete
      }
    });
  } catch (error) {
    console.error("Complete student registration error:", error);
    res.status(500).json({ 
      message: "Failed to complete student registration", 
      error: error.message 
    });
  }
};