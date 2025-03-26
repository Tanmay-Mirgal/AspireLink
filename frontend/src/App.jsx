import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import Signup from "./pages/Signup/Signup";
import Login from './pages/Login/Login';
import Role from './pages/Role/Role';
import MentorCompleteProfile from './pages/Mentor/CompleteProfile/CompleteProfile';
import StudentCompleteProfile from './pages/User/CompleteProfile/CompleteProfile';
import Dashboard from "./pages/Admin/Dashboard/Dashboard"
import StudentProfile from './pages/User/StudentProfilePage';
import MentorProfile from './pages/Mentor/MentorProfile';
import MinimalistSidebar from './components/sidebar/MinimalistSidebar';

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
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/mentorprofile" element={<MentorProfile />} />

      </Routes>
      <Toaster />
    </>
  );
}

export default App;