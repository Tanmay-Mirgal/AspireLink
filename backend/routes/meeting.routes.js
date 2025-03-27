import express from 'express';


import { mentorRole, studentRole,protectedRoute } from '../middlewares/auth.middleware.js';
import { createMeeting, deleteMeeting, getMentorMeetings, getStudentMeetings, updateMeeting } from '../controllers/meeting.controller.js';

const router = express.Router();


router.post('/create-meeting', 
    protectedRoute,  
    mentorRole,  
    createMeeting
);


router.get('/mentor-meetings', 
    protectedRoute,
    mentorRole,
    getMentorMeetings
);


router.get('/student-meetings', 
    protectedRoute,
    studentRole,
    getStudentMeetings
);


router.put('/update/:meetingId', 
    protectedRoute,
    updateMeeting
);


router.delete('/delete/:meetingId', 
    protectedRoute,
    deleteMeeting
);

export default router;