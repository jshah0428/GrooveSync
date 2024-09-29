import React from "react";
import "./Splash.css"; // Import the CSS file
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useAuth0 } from "@auth0/auth0-react";


const Splash = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div className="splash-container">
      <div className="splashlogin">
        {isAuthenticated && <span className="z-10">{user.name}</span>}
        {isAuthenticated ? <button onClick={() => logout()}>Logout</button> :
          <button onClick={() => loginWithRedirect()} className="splashbutton">Log In</button>}
      </div>
      <div className= "music">
      <Link to="/musical-career-game" className="text-link"> <button className="splashbutton">Music Career</button> </Link>
      </div>
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
            <filter id="dropShadow" x="0" y="0" width="200%" height="200%">
              <feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <text fill="white" fontSize="80" fontFamily="disco">
            <Link to="/disco" className="text-link">
            <textPath href="#circlePath" startOffset="2%">
              Welcome to Disco!
            </textPath></Link>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Splash;