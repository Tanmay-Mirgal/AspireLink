import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import MinimalistSidebar from './components/sidebar/MinimalistSidebar';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <>
    <MinimalistSidebar/>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    <Footer />
    </>
  );
}

export default App;