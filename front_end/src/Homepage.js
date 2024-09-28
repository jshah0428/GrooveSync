import React, { useState } from "react";
import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";
import QuestionAnswerBox from './gptQuestions';

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

  const history = [

  ]

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
        <h2>Click the tiles for some Disco Facts!</h2>
        <h2>Brief History of Disco</h2>
        <p>Disco is a genre of dance music that emerged in the early 1970s and became a dominant force in popular music by the mid-1970s. It originated in the United States, particularly in urban areas like New York City, and was heavily influenced by funk, soul, and Latin music. Disco is characterized by a steady four-on-the-floor beat, syncopated basslines, and orchestral elements such as strings and horns.</p>
        <p><strong>Key Milestones in Disco History:</strong></p>
        <ul>
          <li><strong>Early 1970s:</strong> Disco began in underground clubs where DJs played a mix of funk, soul, and Latin music. These clubs were often frequented by marginalized communities, including African Americans, Latinos, and the LGBTQ+ community.</li>
          <li><strong>Mid-1970s:</strong> Disco gained mainstream popularity with hits like "Love to Love You Baby" by Donna Summer and "The Hustle" by Van McCoy. The release of the film "Saturday Night Fever" in 1977, featuring John Travolta and the music of the Bee Gees, catapulted disco into the global spotlight.</li>
          <li><strong>Late 1970s:</strong> Disco reached its peak with numerous chart-topping hits and the rise of iconic artists such as Donna Summer, the Bee Gees, Gloria Gaynor, and Chic. Famous disco clubs like Studio 54 in New York City became cultural landmarks.</li>
          <li><strong>Early 1980s:</strong> Disco's popularity began to wane due to a backlash against the genre, epitomized by events like the "Disco Demolition Night" in 1979. Despite the decline in mainstream popularity, disco continued to influence other genres, including electronic dance music (EDM) and house music.</li>
          <li><strong>Legacy:</strong> Disco's influence can still be seen in modern music, fashion, and culture. Its emphasis on danceability and rhythm laid the groundwork for many contemporary dance genres.</li>
        </ul>
        </div>
      <div className="gpt-box">
        <h1>GROOVY ???</h1>
        <QuestionAnswerBox />

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