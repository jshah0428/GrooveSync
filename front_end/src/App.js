import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './Homepage';
import MusicalCareerGame from './MusicalCareerGame';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null;
};

const PrivateRoute = ({ children }) => {
  const authed = isAuthenticated();
  return authed ? children : <Navigate to="/login" />;
}


function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/musical-career-game" element={<MusicalCareerGame />} />
      </Routes>
    </div>
  );
}

export default App;

