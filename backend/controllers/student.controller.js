import { User } from "../models/user.model.js";

export const sendMentorRequest = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { mentorId } = req.body;

    // Validate input
    if (!mentorId) {
      return res.status(400).json({
        message: "Mentor ID is required"
      });
    }

    // Find mentor and validate
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(404).json({
        message: "Valid mentor not found"
      });
    }

    // Find student and validate
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({
        message: "Valid student not found"
      });
    }

    // Check if mentor is already assigned
    if (student.studentProfile.assignedMentor.includes(mentorId)) {
      return res.status(400).json({
        message: "This mentor is already assigned to you"
      });
    }

    // Check if request already exists
    if (student.studentProfile.requestedMentor.includes(mentorId)) {
      return res.status(400).json({
        message: "You have already sent a request to this mentor"
      });
    }

    // Add mentor to student's requested mentors
    student.studentProfile.requestedMentor.push(mentorId);

    // Add student to mentor's requests
    mentor.mentorSchema[0].requests.push(studentId);

    // Save both documents
    await student.save();
    await mentor.save();

    return res.status(200).json({
      message: "Mentor request sent successfully",
      student: {
        _id: student._id,
        requestedMentors: student.studentProfile.requestedMentor
      },
      mentor: {
        _id: mentor._id,
        incomingRequests: mentor.mentorSchema[0].requests
      }
    });

  } catch (error) {
    console.error("Error in sendMentorRequest:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
export const mentorsAssigned = async (req, res) => {
    try {
      const studentId = req.user._id;
  
      // Find student and validate
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({
          message: "Valid student not found"
        });
      }
  
      // Check if student has assigned mentors
      if (student.studentProfile.assignedMentor.length === 0) {
        return res.status(200).json({
          message: "No mentors assigned",
          mentors: []
        });
      }
  
      // Fetch detailed mentor information
      const mentors = await User.find({
        _id: { $in: student.studentProfile.assignedMentor },
        role: 'mentor'
      }).select({
        'fullName.firstName': 1,
        'fullName.lastName': 1,
        'mentorSchema.companyName': 1,
        'mentorSchema.skills': 1,
        'mentorSchema.experience': 1,
        'profilePic': 1,
        'bio': 1
      });
  
      // Transform mentor data
      const formattedMentors = mentors.map(mentor => ({
        _id: mentor._id,
        fullName: `${mentor.fullName.firstName} ${mentor.fullName.lastName}`,
        companyName: mentor.mentorSchema[0]?.companyName || 'Not specified',
        skills: mentor.mentorSchema[0]?.skills || [],
        experience: mentor.mentorSchema[0]?.experience || 'Not specified',
        profilePic: mentor.profilePic,
        bio: mentor.bio
      }));
  
      return res.status(200).json({
        message: "Assigned mentors retrieved successfully",
        mentors: formattedMentors
      });
  
    } catch (error) {
      console.error("Error retrieving assigned mentors:", error);
      return res.status(500).json({
        message: "Failed to retrieve assigned mentors",
        error: error.message
      });
    }

};
export const getSkillsAnalytics = async (req, res) => {
    try {
      const studentId = req.user._id;
  
      // Find student and validate
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({
          message: "Valid student not found"
        });
      }
  
      // Predefined industry skills benchmark
      const industrySkillsData = [
        { subject: "HTML/CSS", benchmark: 85 },
        { subject: "JavaScript", benchmark: 90 },
        { subject: "React", benchmark: 85 },
        { subject: "Node.js", benchmark: 80 },
        { subject: "UI/UX", benchmark: 75 },
        { subject: "Git", benchmark: 80 },
        { subject: "Python", benchmark: 70 },
        { subject: "Database", benchmark: 75 },
        { subject: "Cloud Computing", benchmark: 65 }
      ];
  
      // Match student skills with industry benchmark
      const studentSkillsData = industrySkillsData.map(industrySkill => {
        // Find matching skill in student's profile
        const matchedStudentSkill = student.studentProfile.skills.find(
          studentSkill => 
            industrySkill.subject.toLowerCase() === studentSkill.name.toLowerCase()
        );
  
        // Calculate student's skill proficiency
        const studentProficiency = matchedStudentSkill 
          ? Math.min(
              Math.max(
                (matchedStudentSkill.proficiency / 5) * 100, 
                0
              ), 
              100
            )
          : 0; // 0 if skill not found
  
        return {
          subject: industrySkill.subject,
          A: studentProficiency, // Student's skill level
          industryBenchmark: industrySkill.benchmark, // Industry benchmark
          fullMark: 100,
          yearsOfExperience: matchedStudentSkill 
            ? matchedStudentSkill.yearsOfExperience 
            : 0
        };
      });
  
      // Additional analytics
      const analytics = {
        totalSkills: studentSkillsData.length,
        skillsCovered: studentSkillsData.filter(skill => skill.A > 0).length,
        averageStudentProficiency: 
          studentSkillsData.reduce((sum, skill) => sum + skill.A, 0) / studentSkillsData.length,
        topSkills: studentSkillsData
          .filter(skill => skill.A > 0)
          .sort((a, b) => b.A - a.A)
          .slice(0, 3),
        skillGapAnalysis: studentSkillsData.map(skill => ({
          subject: skill.subject,
          studentLevel: skill.A,
          industryBenchmark: skill.industryBenchmark,
          gap: Math.max(skill.industryBenchmark - skill.A, 0)
        }))
      };
  
      return res.status(200).json({
        message: "Skills analytics retrieved successfully",
        studentSkillsData,
        industrySkillsData,
        analytics
      });
  
    } catch (error) {
      console.error("Error retrieving skills analytics:", error);
      return res.status(500).json({
        message: "Failed to retrieve skills analytics",
        error: error.message
      });
    }
};



