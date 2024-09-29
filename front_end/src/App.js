import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
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

function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  sparkle.style.top = `${Math.random() * 100}vh`;
  sparkle.style.left = `${Math.random() * 100}vw`;
  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 1000); // Remove sparkle after animation
}

function App() {
  const location = useLocation();
  useEffect(() => {
    for (let i = 0; i < 30; i++) {
      createSparkle();
    }
  }, [location]);

  return (
    <div className="App">
      <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={500}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/disco" element={<Homepage />} />
        <Route path="/musical-career-game" element={<MusicalCareerGame />} />
      </Routes>
      </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;

