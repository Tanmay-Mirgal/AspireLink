import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

import MinimalistSidebar from './components/sidebar/MinimalistSidebar';
import Footer from './components/Footer/Footer';
// import StudentDasboard from './pages/User/StudentDashboard';

import Signup from "./pages/Signup/Signup"
import Login from './pages/Login/Login';
import StudentProfilePage from './pages/User/StudentProfilePage';
import MentorProfile from './pages/Mentor/MentorProfile';



function App() {
  return (
    <>
    <MinimalistSidebar/>
    <Routes>
      <Route path="/" element={<Home />} />


      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path='/studentprofile' element={<StudentProfilePage/>} />
      <Route path='/mentorprofile' element={<MentorProfile/>} />


    </Routes>
    <Footer />
    </>
  );
}

export default App;