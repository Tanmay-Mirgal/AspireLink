import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import Signup from "./pages/Signup/Signup";
import Login from './pages/Login/Login';
import Role from './pages/Role/Role';
import StudentProfile from './pages/User/StudentProfilePage';
import MentorProfile from './pages/Mentor/MentorProfile';
import MinimalistSidebar from './components/sidebar/MinimalistSidebar';

function App() {
  return (
    <>
    <MinimalistSidebar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/mentorprofile" element={<MentorProfile />} />

      </Routes>
      <Toaster />
    </>
  );
}

export default App;