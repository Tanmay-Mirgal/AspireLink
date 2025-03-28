import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import Signup from "./pages/Signup/Signup";
import Login from './pages/Login/Login';
import Role from './pages/Role/Role';
import MentorCompleteProfile from './pages/Mentor/CompleteProfile/CompleteProfile';
import StudentCompleteProfile from './pages/User/CompleteProfile/CompleteProfile';
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import MentorDashboard from './pages/Mentor/Dashboard/Dashboard';
import StudentDashboard from './pages/User/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
// import UserDetailProfilePage from './pages/Profile/UserDetailProfilePage';
import Feed from './pages/Feed/Feed';
import Forum from './pages/Forum/Forums';
import { ForumDetail } from './pages/Forum/ForumDetail';
import JoinPage from './pages/Meeting/JoinPage';
import MeetingPage from './pages/Meeting/Meeting';
import JobDetail from './pages/JobDetails/JobDetails';

function App() {
  return (
    <>
      {/* <MinimalistSidebar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/mentor-complete-profile" element={<MentorCompleteProfile />} />
        <Route path="/student-complete-profile" element={<StudentCompleteProfile />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/profile/:id" element={<UserDetailProfilePage />} /> */}
        <Route path="/feed" element={<Feed />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumDetail />} />
        <Route path="/job/:jobId" element={<JobDetail />} />
        
        {/* Fixed Meeting Routes */}
        <Route path="/meeting" element={<JoinPage />} />
        <Route path="/meeting/:roomId" element={<MeetingPage />} />
        
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;