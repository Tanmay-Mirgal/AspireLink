import Meeting from "../models/meeting.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { meetingCreatedEmail } from "../templates/emailTemplates.js";
import { sendMail } from "../utils/utility.js";


export const createMeeting = async (req, res) => {
    try {
        const { studentIds, mentorId, date, time } = req.body;

        // Validate mentor exists and is a mentor
        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== "mentor") {
            return res.status(400).json({
                message: "Invalid mentor specified",
            });
        }

        // Validate students exist
        const students = await User.find({
            _id: { $in: studentIds },
            "studentProfile.assignedMentor": mentorId,
        });

        if (students.length !== studentIds.length) {
            return res.status(400).json({
                message: "One or more students are invalid or not assigned to this mentor",
            });
        }

        // Check for existing meetings at the same time
        const existingMeeting = await Meeting.findOne({
            mentorId,
            date,
            time,
        });

        if (existingMeeting) {
            return res.status(409).json({
                message: "A meeting at this time already exists",
            });
        }

        // Generate a unique passcode
        const passcode = crypto.randomBytes(4).toString("hex");

        // Create new meeting with default status "pending"
        const newMeeting = new Meeting({
            studentId: studentIds,
            mentorId,
            date,
            time,
            passcode,
            status: "pending",
        });

        await newMeeting.save();

        // Send email to students
        const mentorName = `${mentor.fullName.firstName} ${mentor.fullName.lastName}`;
        const emailContent = meetingCreatedEmail({
            mentorName,
            date,
            time,
            passcode,
        });

        const info = await sendMail({
            to: students.map((student) => student.email),
            subject: "Meeting Scheduled",
            html: emailContent,
        });

        console.log("Email sent successfully:", info.response);

        return res.status(201).json({
            message: "Meeting created successfully",
            meeting: newMeeting,
        });
    } catch (error) {
        console.error("Error creating meeting:", error);
        return res.status(500).json({
            message: "Failed to create meeting",
            error: error.message,
        });
    }
};
export const getMentorMeetings = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // Validate mentor
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({
        message: "User is not authorized as a mentor",
      });
    }

    // Find meetings and populate student details
    const meetings = await Meeting.find({ mentorId })
      .populate({
        path: "studentId",
        select: "fullName email studentProfile.skills profilePic",
      })
      .sort({ date: 1, time: 1 }); // Sort by date and time

    return res.status(200).json({
      message: "Mentor meetings retrieved successfully",
      meetings,
    });
  } catch (error) {
    console.error("Error retrieving mentor meetings:", error);
    return res.status(500).json({
      message: "Failed to retrieve meetings",
      error: error.message,
    });
  }
};
export const getStudentMeetings = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(403).json({
        message: "User is not authorized as a student",
      });
    }

    // Find meetings and populate mentor details
    const meetings = await Meeting.find({ studentId })
      .populate({
        path: "mentorId",
        select: "fullName email mentorSchema.skills profilePic",
      })
      .sort({ date: 1, time: 1 }); // Sort by date and time

    return res.status(200).json({
      message: "Student meetings retrieved successfully",
      meetings,
    });
  } catch (error) {
    console.error("Error retrieving student meetings:", error);
    return res.status(500).json({
      message: "Failed to retrieve meetings",
      error: error.message,
    });
  }
};
export const updateMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { date, time, studentIds, status } = req.body;
    const userId = req.user._id;

    // Find the meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // Validate user's right to update (either mentor or student)
    const isUserMentor = await User.findOne({
      _id: userId,
      role: "mentor",
      _id: meeting.mentorId,
    });

    const isUserStudent = studentIds && studentIds.includes(userId.toString());

    if (!isUserMentor && !isUserStudent) {
      return res.status(403).json({
        message: "Not authorized to update this meeting",
      });
    }

    // Validate students if provided
    if (studentIds) {
      const students = await User.find({
        _id: { $in: studentIds },
        "studentProfile.assignedMentor": meeting.mentorId,
      });

      if (students.length !== studentIds.length) {
        return res.status(400).json({
          message:
            "One or more students are invalid or not assigned to this mentor",
        });
      }
    }

    // Check for conflicting meetings
    const existingMeeting = await Meeting.findOne({
      mentorId: meeting.mentorId,
      date: date || meeting.date,
      time: time || meeting.time,
      _id: { $ne: meetingId },
    });

    if (existingMeeting) {
      return res.status(409).json({
        message: "A meeting at this time already exists",
      });
    }

    // Update meeting
    meeting.date = date || meeting.date;
    meeting.time = time || meeting.time;
    meeting.studentId = studentIds || meeting.studentId;
    meeting.status = status || meeting.status;

    await meeting.save();

    return res.status(200).json({
      message: "Meeting updated successfully",
      meeting,
    });
  } catch (error) {
    console.error("Error updating meeting:", error);
    return res.status(500).json({
      message: "Failed to update meeting",
      error: error.message,
    });
  }
};
export const deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    // Find the meeting
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    // Validate user's right to delete (either mentor or student)
    const isUserMentor = await User.findOne({
      _id: userId,
      role: "mentor",
      _id: meeting.mentorId,
    });

    const isUserStudent = meeting.studentId.some(
      (id) => id.toString() === userId.toString()
    );

    if (!isUserMentor && !isUserStudent) {
      return res.status(403).json({
        message: "Not authorized to delete this meeting",
      });
    }

    // Delete the meeting
    await Meeting.findByIdAndDelete(meetingId);

    return res.status(200).json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return res.status(500).json({
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
};
