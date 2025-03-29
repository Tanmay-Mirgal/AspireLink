import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ModernNavbar from './components/sidebar/ModernNavbar';
import ProtectedRoute from './components/protected-route/ProtectedRoute';

// Eagerly loaded components
import Home from './pages/Home/Home';
import { ForumDetail } from './pages/Forum/ForumDetail';
import Forums from './pages/Forum/Forums';
import ResumeBuilder from './pages/Resume/Resume';
import Footer from './components/Footer/Footer';

// Lazily loaded components
const Signup = lazy(() => import('./pages/Signup/Signup'));
const Login = lazy(() => import('./pages/Login/Login'));
const Role = lazy(() => import('./pages/Role/Role'));
const MentorCompleteProfile = lazy(() => import('./pages/Mentor/CompleteProfile/CompleteProfile'));
const StudentCompleteProfile = lazy(() => import('./pages/User/CompleteProfile/CompleteProfile'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const MentorDashboard = lazy(() => import('./pages/Mentor/Dashboard/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/User/Dashboard/Dashboard'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Feed = lazy(() => import('./pages/Feed/Feed'));

const JoinPage = lazy(() => import('./pages/Meeting/JoinPage'));
const MeetingPage = lazy(() => import('./pages/Meeting/Meeting'));
const ProjectsPage = lazy(() => import('./pages/Projects/ProjectsPage'));
const ProjectDetailsPage = lazy(() => import('./pages/Projects/ProjectDetailsPage'));
const JobDetail = lazy(() => import('./pages/JobDetails/JobDetails'));
const UserDetailProfilePage = lazy(() => import('./pages/Profile/UserDetailProfilePage '));
const Jobs = lazy(() => import('./pages/Jobs/Jobs'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <>
      <ModernNavbar />
      <Suspense fallback={<LoadingFallback />}>
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
          <Route path="/forum" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
          <Route path="/forum/:id" element={<ProtectedRoute><ForumDetail /></ProtectedRoute>} />
          <Route path="/job/:jobId" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
          <Route path="/meeting" element={<ProtectedRoute><JoinPage /></ProtectedRoute>} />
          <Route path="/meeting/:roomId" element={<ProtectedRoute><MeetingPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
          <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
          <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        </Routes>
      </Suspense>
      <Footer/>
      <Toaster />
    </>
  );
}

export default App;