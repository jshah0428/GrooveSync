import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { useAuth0 } from "@auth0/auth0-react";
import QuestionAnswerBox from './gptQuestions';
import { Link } from "react-router-dom"; 

const fallbacks = [
  "https://p.scdn.co/mp3-preview/98e266fea9df84fa3e5ca84934c513211e89489b?cid=a77073181b7d48eb90003e3bb94ff88a",
  "https://p.scdn.co/mp3-preview/c5e4b03bcf18d2b137370569baeb74a9dfce7e63?cid=a77073181b7d48eb90003e3bb94ff88a",
  "https://p.scdn.co/mp3-preview/3f23e60bf84a17c8b9bb8f3f75c6896e41b32bbb?cid=a77073181b7d48eb90003e3bb94ff88a",
  "https://p.scdn.co/mp3-preview/5031e0d1f4e1dedd05ade1b24a3beec07d7c75ce?cid=a77073181b7d48eb90003e3bb94ff88a",
  "https://p.scdn.co/mp3-preview/1692d6f433c2e5a5d99ce5cdfcd09aa8057e3dc5?cid=a77073181b7d48eb90003e3bb94ff88a"
]

const HomePage = () => {
  const [popupInfo, setPopupInfo] = useState({ visible: false, content: "" });
  const [token, setToken] = useState(null);
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [song, setSong] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getRandomFallbackUrl = () => {
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    return fallbacks[randomIndex];
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=a77073181b7d48eb90003e3bb94ff88a&client_secret=68790982a0554d1a83427e061e371507",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        setToken(jsonData.access_token);
      } catch (error) {
      } finally {
      }
    };

    fetchToken();
  }, [])

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
      "#800080", "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#D8BFD8", "#e666bc", "#be3fd0",
      // Shades of blue
      "#0000FF", "#1E90FF", "#00BFFF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#8742b0",
      // Shades of white
      "#FFFFFF", "#F8F8FF", "#FFFAFA", "#F0F8FF", "#F5F5F5"
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
        onClick={() => { handleTileClick(fact); fetchAndPlayRandomSong() }}
        style={{ backgroundColor: color }}
      >
      </div>
    );
  });

  const fetchAndPlayRandomSong = async () => {
    const keyword = "pop";
    const resultOffset = Math.floor(Math.random() * 50); // Random offset for different search results
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${keyword}&type=track&limit=1&offset=${resultOffset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.tracks.items.length > 0) {
      const randomSong = data.tracks.items[0];
      console.log("element", randomSong);
      setSong({
        element: randomSong,
        name: randomSong.name,
        artist: randomSong.artists[0].name,
        url: randomSong.preview_url,
      });
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = randomSong.preview_url || getRandomFallbackUrl();
        audioRef.current.load();

        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Failed to start audio playback:', error);
          });
      }
    } else {
      setSong(null);
    }
  }

  const handleTileClick = (fact) => {
    setPopupInfo({
      visible: true,
      content: fact,
    });
  };

  const closePopup = () => {
    setPopupInfo({ visible: false, content: "" });
  };

  const getYouTubeVideoID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  const videoURL = "https://www.youtube.com/watch?v=Da4f95F_1b4"; // Replace with your video URL
  const videoID = getYouTubeVideoID(videoURL);

  return (
    <div className="homepage">
        <div className="video-background">
          <iframe
          src={`https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&playlist=${videoID}`}

            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Background Video"
          ></iframe>
        </div>
      <div className="header-container">
      <Link to="/" className="text-link"> <button className="login-button">Home</button> 
      </Link> 
      <Link to="/musical-career-game" className="text-link"> <button className="login-button">Music Career</button> 
      </Link> 
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
        <div className="fact-container">
        <h2>Click the tiles!</h2>
        </div>
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
        <h1>GROOVY ?</h1>
        <QuestionAnswerBox />

      </div>

      {popupInfo.visible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <p>{popupInfo.content}</p>
            <audio src={'https://p.scdn.co/mp3-preview/98e266fea9df84fa3e5ca84934c513211e89489b?cid=a77073181b7d48eb90003e3bb94ff88a'}
              id="audio" ref={audioRef} ></audio>
            <div className="card">
              <div className="cursor-pointer ratio ratio-1x1 bg-secondary bg-opacity-25">
                <img
                  width={50}
                  src={song?.element?.album?.images[0]?.url || song?.element.imageUrl || 'https://thumbs.dreamstime.com/b/vector-musical-notes-music-gray-background-illustration-eps-141771086.jpg'}
                  className="card-img-top"
                  alt="..."
                />
              </div>
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between mb-0">
                  <p className="text-elipsis">{song?.element.name || song?.element.songName}</p>
                  <div className="add-options d-flex align-items-start">
                    <button
                      type="button"
                      className="btn btn-outline-dark mx-1"
                    >
                      Add to Playlist
                    </button>
                  </div>

                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;