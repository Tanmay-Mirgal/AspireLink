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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/mentor-complete-profile" element={<MentorCompleteProfile />} />
        <Route path="/student-complete-profile" element={<StudentCompleteProfile />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;