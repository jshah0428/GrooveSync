import React from "react";
import "./Splash.css"; // Import the CSS file
import { Link } from "react-router-dom"; // Import Link from react-router-dom


const Splash = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
      <svg width="900" height="900" viewBox="0 0 900 900">
          <defs>
            <path
              id="circlePath"
              d="M 450, 450
                 m -400, 0
                 a 400,400 0 1,1 800,0
                 a 400,400 0 1,1 -800,0"
            />
          </defs>
          <text fill="white" fontSize="60" fontFamily="disco">
            <Link to="/disco">
            <textPath href="#circlePath" startOffset="2%">
              Welcome to Disco World!
            </textPath></Link>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Splash;