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
import Feed from './pages/Feed/Feed';
import Forum from './pages/Forum/Forums';
import { ForumDetail } from './pages/Forum/ForumDetail';
import JoinPage from './pages/Meeting/JoinPage';
import MeetingPage from './pages/Meeting/Meeting';
import ModernNavbar from './components/sidebar/ModernNavbar';

import ProjectsPage from './pages/Projects/ProjectsPage';
import ProjectDetailsPage from './pages/Projects/ProjectDetailsPage';
import JobDetail from './pages/JobDetails/JobDetails';
import UserDetailProfilePage from './pages/Profile/UserDetailProfilePage ';
import Jobs from './pages/Jobs/Jobs';

function App() {
  return (
    <>
     <ModernNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/mentor-complete-profile" element={<MentorCompleteProfile />} />
        <Route path="/student-complete-profile" element={<StudentCompleteProfile />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserDetailProfilePage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:id" element={<ForumDetail />} />
        <Route path="/job/:jobId" element={<JobDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        
        {/* Fixed Meeting Routes */}
        <Route path="/meeting" element={<JoinPage />} />
        <Route path="/meeting/:roomId" element={<MeetingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />

        
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;