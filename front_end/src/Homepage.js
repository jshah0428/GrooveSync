import React, { useState } from "react";
import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const [popupInfo, setPopupInfo] = useState({ visible: false, content: "" });
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log(user);

  const facts = [
    "Disco originated in the 1970s.",
    "The first disco club was in New York City.",
    "Disco balls are also known as mirror balls.",
    "The Bee Gees were a famous disco band.",
    "Saturday Night Fever popularized disco.",
    "Disco music is characterized by a steady four-on-the-floor beat.",
    "Donna Summer was known as the Queen of Disco.",
    "Disco fashion included bell-bottoms and platform shoes.",
    "Studio 54 was a famous disco club in NYC.",
    "Disco influenced the development of electronic dance music."
  ];

  const getRandomColorAndFact = () => {
    const colors = [
      // Shades of purple
      "#800080", "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#D8BFD8",
      // Shades of blue
      "#0000FF", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6",
      // Shades of white
      "#FFFFFF", "#F8F8FF", "#FFFAFA", "#F0F8FF", "#F5F5F5", "#FFF5EE"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    return { color, fact };
  };

  const tiles = Array.from({ length: 100 }, (_, index) => {
    const { color, fact } = getRandomColorAndFact();
    return (
      <div
        key={index}
        className="tile"
        onClick={() => handleTileClick(fact)}
        style={{ backgroundColor: color }}
      >
        <div className="tile-info"></div>
      </div>
    );
  });

  const handleTileClick = (fact) => {
    setPopupInfo({
      visible: true,
      content: fact,
    });
  };

  const closePopup = () => {
    setPopupInfo({ visible: false, content: "" });
  };

  return (
    <div className="homepage">
      <div className="header-container">
        {isAuthenticated && <span className="z-10">{user.name}</span>}
        {isAuthenticated ? <button className="login-button" onClick={() => logout()}>Logout</button> :
          <button onClick={() => loginWithRedirect()} className="login-button">Log In</button>}
      </div>

      <div className="room">
        <div className="disco-ball"></div>
        <div className="light-beam beam1"></div>
        <div className="light-beam beam2"></div>
        <div className="light-beam beam3"></div>
        <div className="light-beam beam4"></div>
        
        <div className="wall wall-back"></div>
        <div className="wall wall-left">
        </div>
        <div className="wall wall-right"></div>
        <div className="floor">{tiles}</div>
      </div>


      <div className="info-box">
        <h1>Groove Sync</h1>
        <p>Click the tiles for some Disco Facts!</p>
        <p>Click the tiles for some Disco Facts!</p>
      </div>
      <div className="gpt-box">
        <p>Powered by Groove Sync</p>
      </div>

      {popupInfo.visible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <p>{popupInfo.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;