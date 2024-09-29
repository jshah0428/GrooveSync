import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Homepage from './Homepage';
import MusicalCareerGame from './MusicalCareerGame';
import Splash from './Splash';
import "./App.css"; // Import the CSS file for transitions


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
        <Route path="/" element={<Splash />} />
        <Route path="/disco" element={<Homepage />} />
        <Route path="/musical-career-game" element={<MusicalCareerGame />} />
      </Routes>
    </div>
  );
}

export default App;

