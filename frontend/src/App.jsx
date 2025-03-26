import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import MinimalistSidebar from './components/sidebar/MinimalistSidebar';
import Footer from './components/Footer/Footer';
// import StudentDasboard from './pages/User/StudentDashboard';


function App() {
  return (
    <>
    <MinimalistSidebar/>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/studdashboard" element={<StudentDasboard/>} /> */}
    </Routes>
    <Footer />
    </>
  );
}

export default App;