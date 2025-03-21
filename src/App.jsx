import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';
import HeroSection from './components/HeroSection.jsx';

function App() {
  return (
   
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/hero" element={<HeroSection/>} />
      </Routes>
   
  );
}

export default App;