import { User } from "../models/user.model.js";

export const getAllMentors = async (req, res) => {
  try {
    const allMentors = await User.find({ role: "mentor" })
      .select("-password")
      .populate("mentorSchema.studentAssigned");
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
    const allStudents = await User.find({ role: "student" })
      .select("-password")
      .populate("studentProfile.assignedMentor");
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
    }).select("-password");
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
    ).select("-password");

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

    if (!studentId || !mentorId) {
      return res.status(400).json({
        message: "Both studentId and mentorId are required",
      });
    }

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    });

    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    if (student.studentProfile.assignedMentor.length > 0) {
      console.log(student.studentProfile.assignedMentor);
      return res.status(400).json({
        message: "Student already has an assigned mentor",
      });
    }

    student.studentProfile.assignedMentor = mentorId;
    await student.save();

    if (mentor.mentorSchema && mentor.mentorSchema.length > 0) {
      mentor.mentorSchema[0].studentAssigned.push(studentId);
      await mentor.save();
    }

    res.status(200).json({
      message: "Mentor assigned successfully",
      student: {
        id: student._id,
        name: `${student.fullName.firstName} ${student.fullName.lastName}`,
        assignedMentor: mentorId,
      },
      mentor: {
        id: mentor._id,
        name: `${mentor.fullName.firstName} ${mentor.fullName.lastName}`,
      },
    });
  } catch (error) {
    console.error("Assign mentor error:", error);
    res.status(500).json({
      message: "Failed to assign mentor",
      error: error.message,
    });
  }
};

export const approvedRegistration = async (req, res) => {
  try {
    const approvedRegistration = await User.find({role:"student", "studentProfile.isProfileComplete": true}).select("-password");
    if (!approvedRegistration) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(approvedRegistration);
  } catch (error) {
    console.error("Approval error:", error);
    res
      .status(500)
      .json({ message: "Failed to approve student", error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    // Get all users
    const students = await User.find({ role: "student" });
    const mentors = await User.find({ role: "mentor" });

    // Calculate mentor-student assignment statistics
    const assignedStudents = students.filter(student => 
      student.studentProfile?.assignedMentor && 
      Array.isArray(student.studentProfile.assignedMentor) && 
      student.studentProfile.assignedMentor.length > 0
    ).length;
    
    const unassignedStudents = students.length - assignedStudents;
    
    const mentorsWithStudents = mentors.filter(mentor => 
      mentor.mentorSchema && 
      mentor.mentorSchema.length > 0 && 
      Array.isArray(mentor.mentorSchema[0]?.studentAssigned) && 
      mentor.mentorSchema[0].studentAssigned.length > 0
    ).length;
    
    const mentorsWithoutStudents = mentors.length - mentorsWithStudents;

    // Calculate profile completion stats - corrected logic
    const completedProfiles = students.filter(
      student => student.studentProfile?.isProfileComplete === true
    ).length;
    
    const incompleteProfiles = students.filter(
      student => student.studentProfile?.isProfileComplete === false
    ).length;

    // Calculate skill distribution
    const skillsMap = {};
    
    // Process student skills
    students.forEach(student => {
      if (Array.isArray(student.studentProfile?.skills)) {
        student.studentProfile.skills.forEach(skill => {
          const skillName = typeof skill === 'string' ? skill : skill?.name;
          if (skillName) {
            if (!skillsMap[skillName]) {
              skillsMap[skillName] = { students: 0, mentors: 0 };
            }
            skillsMap[skillName].students += 1;
          }
        });
      }
    });
    
    // Process mentor skills
    mentors.forEach(mentor => {
      if (mentor.mentorSchema && mentor.mentorSchema.length > 0 && Array.isArray(mentor.mentorSchema[0]?.skills)) {
        mentor.mentorSchema[0].skills.forEach(skill => {
          const skillName = typeof skill === 'string' ? skill : skill?.name;
          if (skillName) {
            if (!skillsMap[skillName]) {
              skillsMap[skillName] = { students: 0, mentors: 0 };
            }
            skillsMap[skillName].mentors += 1;
          }
        });
      }
    });
    
    // Convert skills map to array for easier frontend consumption
    const skillsDistribution = Object.entries(skillsMap)
      .map(([name, counts]) => ({
        name,
        students: counts.students,
        mentors: counts.mentors,
        total: counts.students + counts.mentors
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Get top 10 skills

    // Calculate monthly growth
    const monthlyGrowth = [];
    
    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentYear, currentMonth - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      // Count students and mentors created in this month
      const studentsInMonth = students.filter(student => {
        const createdAt = new Date(student.createdAt);
        return createdAt.getMonth() === month.getMonth() && 
               createdAt.getFullYear() === month.getFullYear();
      }).length;
      
      const mentorsInMonth = mentors.filter(mentor => {
        const createdAt = new Date(mentor.createdAt);
        return createdAt.getMonth() === month.getMonth() && 
               createdAt.getFullYear() === month.getFullYear();
      }).length;
      
      // Count connections (assignments) made in this month
      // This is a simplified approach - in reality you'd track when assignments were made
      const connectionsInMonth = Math.min(studentsInMonth, mentorsInMonth);
      
      monthlyGrowth.push({
        name: monthName,
        students: studentsInMonth,
        mentors: mentorsInMonth,
        connections: connectionsInMonth
      });
    }

    // Prepare the response
    const analyticsData = {
      totalStudents: students.length,
      totalMentors: mentors.length,
      assignmentStats: {
        assignedStudents,
        unassignedStudents,
        mentorsWithStudents,
        mentorsWithoutStudents
      },
      profileStats: {
        completedProfiles,
        incompleteProfiles
      },
      skillsDistribution,
      monthlyGrowth
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Failed to fetch analytics data",
      error: error.message
    });
  }
};