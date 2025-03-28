import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import ProtectedRoute from './components/protected-route/ProtectedRoute';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <>
     <ModernNavbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={user ? <Navigate to={"/"} replace /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to={"/"} replace /> : <Login />} />
        <Route path="/role" element={<ProtectedRoute><Role /></ProtectedRoute>} />
        <Route path="/mentor-complete-profile" element={<ProtectedRoute><MentorCompleteProfile /></ProtectedRoute>} />
        <Route path="/student-complete-profile" element={<ProtectedRoute><StudentCompleteProfile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><UserDetailProfilePage /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
        <Route path="/forum/:id" element={<ProtectedRoute><ForumDetail /></ProtectedRoute>} />
        <Route path="/job/:jobId" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/meeting" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
        <Route path="/meeting/:roomId" element={<ProtectedRoute><MeetingPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
        <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
        <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />

      </Routes>
      <Toaster />
    </>
  );
}

export default App;
