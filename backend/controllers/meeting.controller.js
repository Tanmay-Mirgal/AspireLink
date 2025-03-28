import Meeting from "../models/meeting.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import {
  jobAppliedAcceptedAndScheduledMeeting,
  meetingCreatedEmail,
} from "../templates/emailTemplates.js";
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
        message:
          "One or more students are invalid or not assigned to this mentor",
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
export const getMeetingRequests = async (req, res) => {
  try {
    const mentorId = req.user._id;

    // Find meetings where the user is the mentor and has pending meeting requests
    const meetings = await Meeting.find({
      mentorId,
      "meetingRequests.status": "pending",
    })
      .populate("meetingRequests.user", "fullName email profilePicture") // Populate user details
      .populate("studentId", "fullName email profilePicture")
      .lean();

    if (!meetings || meetings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending meeting requests found",
        data: [],
      });
    }

    // Process the results to format the response data
    const pendingRequests = meetings.flatMap((meeting) => {
      return meeting.meetingRequests
        .filter((request) => request.status === "pending")
        .map((request) => ({
          meetingId: meeting._id,
          requestId: request._id,
          student: request.user,
          date: meeting.date,
          time: meeting.time,
          status: request.status,
          createdAt: request._id ? request._id.getTimestamp() : new Date(), // Extract timestamp from ObjectId
        }));
    });

    return res.status(200).json({
      success: true,
      message: "Meeting requests retrieved successfully",
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching meeting requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meeting requests",
      error: error.message,
    });
  }
};
export const respondToMeetingRequest = async (req, res) => {
  try {
    const { meetingId, requestId, action } = req.body;
    const mentorId = req.user._id;

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Action must be 'accepted' or 'rejected'",
      });
    }

    // Find the meeting and ensure the mentor is authorized
    const meeting = await Meeting.findOne({
      _id: meetingId,
      mentorId,
    }).populate("meetingRequests.user", "email fullName");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or you are not authorized",
      });
    }

    // Find the specific request within the meeting
    const requestIndex = meeting.meetingRequests.findIndex(
      (request) => request._id.toString() === requestId
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Meeting request not found",
      });
    }

    // Update the request status
    meeting.meetingRequests[requestIndex].status = action;

    // If accepting, also add the student to the studentId array if not already there
    if (action === "accepted") {
      const studentId = meeting.meetingRequests[requestIndex].user._id;

      // Check if the student is already in the studentId array
      if (!meeting.studentId.includes(studentId)) {
        meeting.studentId.push(studentId);
      }
    }
    await meeting.save();

    const studentEmail = meeting.meetingRequests[requestIndex].user.email;
    console.log("Student email:", studentEmail);
     const info = await sendMail({
      to: studentEmail,
      subject: `Meeting Request ${
        action.charAt(0).toUpperCase() + action.slice(1)
      }`,
      html: jobAppliedAcceptedAndScheduledMeeting({
        
        studentName: meeting.meetingRequests[requestIndex].user.fullName,
        action,
        date: meeting.date,
        time: meeting.time,
        passcode: meeting.passcode,
      }),
    });
    console.log("Email sent successfully:", info.response);

    return res.status(200).json({
      success: true,
      message: `Meeting request ${action} successfully`,
      data: meeting,
    });
  } catch (error) {
    console.error(`Error ${req.body.action} meeting request:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to ${req.body.action} meeting request`,
      error: error.message,
    });
  }
};
export const createOrUpdateMeeting = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { date, time, students, passcode, meetingId } = req.body;

    // Validate input
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required",
      });
    }

    let meeting;

    if (meetingId) {
      // Update existing meeting
      meeting = await Meeting.findOne({ _id: meetingId, mentorId });

      if (!meeting) {
        return res.status(404).json({
          success: false,
          message: "Meeting not found or you are not authorized to update it",
        });
      }

      // Update fields
      meeting.date = new Date(date);
      meeting.time = time;

      if (passcode) {
        meeting.passcode = passcode;
      }

      // If students array is provided, update it
      if (students && Array.isArray(students)) {
        // Validate that all student IDs exist in the database
        const validStudents = await User.find({
          _id: { $in: students },
          role: "student",
        }).select("_id");

        const validStudentIds = validStudents.map((s) => s._id.toString());

        // Filter out any invalid student IDs
        const filteredStudents = students.filter((id) =>
          validStudentIds.includes(id.toString())
        );

        meeting.studentId = filteredStudents;
      }
    } else {
      // Create new meeting
      const generatedPasscode =
        passcode || Math.random().toString(36).substring(2, 8).toUpperCase();

      // Initialize with empty students array if none provided
      const studentArray = students && Array.isArray(students) ? students : [];

      meeting = new Meeting({
        mentorId,
        studentId: studentArray,
        date: new Date(date),
        time,
        passcode: generatedPasscode,
        status: "pending",
      });
    }

    await meeting.save();

    return res.status(meetingId ? 200 : 201).json({
      success: true,
      message: meetingId
        ? "Meeting updated successfully"
        : "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Error creating/updating meeting:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create/update meeting",
      error: error.message,
    });
  }
};

export const updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status
    if (!["pending", "started", "finished"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Status must be 'pending', 'started', or 'finished'",
      });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Verify that the user is the mentor for this meeting
    if (meeting.mentorId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the mentor can update the meeting status",
      });
    }

    meeting.status = status;
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting status updated successfully",
      data: meeting,
    });
  } catch (error) {
    console.error("Error updating meeting status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update meeting status",
      error: error.message,
    });
  }
};
// Function to get all accepted meeting participants
export const getMeetingParticipants = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findById(meetingId)
      .populate("studentId", "fullName email profilePicture")
      .populate("mentorId", "fullName email profilePicture")
      .lean();

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Check if the requesting user is either the mentor or an accepted student
    const isMentor = meeting.mentorId._id.toString() === userId.toString();
    const isAcceptedStudent = meeting.studentId.some(
      (student) => student._id.toString() === userId.toString()
    );

    if (!isMentor && !isAcceptedStudent) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this meeting",
      });
    }

    // Format the response
    const participants = {
      mentor: meeting.mentorId,
      students: meeting.studentId,
      meetingDetails: {
        date: meeting.date,
        time: meeting.time,
        passcode: meeting.passcode,
        status: meeting.status,
      },
    };

    return res.status(200).json({
      success: true,
      message: "Meeting participants retrieved successfully",
      data: participants,
    });
  } catch (error) {
    console.error("Error fetching meeting participants:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meeting participants",
      error: error.message,
    });
  }
};
