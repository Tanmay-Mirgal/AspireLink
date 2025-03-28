import express from "express";
import {
  mentorRole,
  studentRole,
  protectedRoute,
} from "../middlewares/auth.middleware.js";
import {
  createMeeting,
  deleteMeeting,
  getMentorMeetings,
  getStudentMeetings,
  updateMeeting,
  getMeetingRequests,
  respondToMeetingRequest,
  createOrUpdateMeeting,
  updateMeetingStatus,
  getMeetingParticipants,
} from "../controllers/meeting.controller.js";

const router = express.Router();

// Existing routes
router.post("/create-meeting", protectedRoute, mentorRole, createMeeting);

router.get("/mentor-meetings", protectedRoute, mentorRole, getMentorMeetings);

router.get(
  "/student-meetings",
  protectedRoute,
  studentRole,
  getStudentMeetings
);

router.put("/update/:meetingId", protectedRoute, updateMeeting);

router.delete("/delete/:meetingId", protectedRoute, deleteMeeting);

// New routes
router.get("/requests", protectedRoute, mentorRole, getMeetingRequests);

router.post(
  "/respond-request",
  protectedRoute,
  mentorRole,
  respondToMeetingRequest
);

router.post(
  "/create-or-update",
  protectedRoute,
  mentorRole,
  createOrUpdateMeeting
);

router.put(
  "/status/:meetingId",
  protectedRoute,
  mentorRole,
  updateMeetingStatus
);

router.get("/participants/:meetingId", protectedRoute, getMeetingParticipants);

export default router;
