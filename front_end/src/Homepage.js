import React, { useState } from "react";
import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
  const [popupInfo, setPopupInfo] = useState({ visible: false, content: "" });
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  console.log(user);

  const handleTileClick = (index) => {
    setPopupInfo({
      visible: true,
      content: `Information about Tile ${index + 1}`,
    });
  };

  const closePopup = () => {
    setPopupInfo({ visible: false, content: "" });
  };

  const getRandomColor = () => {
    const colors = [
      // Shades of purple
      "#800080", "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#D8BFD8",
      // Shades of blue
      "#0000FF", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6",
      // Shades of white
      "#FFFFFF", "#F8F8FF", "#FFFAFA", "#F0F8FF", "#F5F5F5", "#FFF5EE"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const tiles = Array.from({ length: 100 }, (_, index) => (
    <div
      key={index}
      className="tile"
      onClick={() => handleTileClick(index)}
      style={{ backgroundColor: getRandomColor() }}
    >
      <div className="tile-info">Tile {index + 1}</div>
    </div>
  ));

  return (
    <div className="homepage">
      <div className="header-container">
        <h1>Welcome to the Groovy Sync</h1>
        {isAuthenticated && <span className="z-10">{user.name}</span>}
        {isAuthenticated ? <button className="login-button" onClick={() => logout()}>Logout</button> :
          <button onClick={() => loginWithRedirect()} className="login-button">Log In</button>}

      </div>
      <p>Hover over the tiles for some Disco Facts!</p>

      <div className="room">
        <div className="disco-ball">
          <div className="light-beam"></div>
          <div className="light-beam"></div>

        </div>
        <div className="wall wall-back"></div>
        <div className="wall wall-left"></div>
        <div className="wall wall-right"></div>
        <div className="floor">{tiles}</div>
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