import React, { useEffect, useState, useRef } from 'react';
import './FavoriteSongsPage.css';

const FavoriteSongsPage = () => {
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentAudio, setCurrentAudio] = useState(null); // Reference to currently playing audio
    const [isMusicPlay, setIsMusicPlay] = useState(false);
    const audioRef = useRef(null); // Ref for audio element

    const fetchFavoriteSongs = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const userId = localStorage.getItem('userId');
        const raw = JSON.stringify({
            userId: userId
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("http://localhost:3001/get-favorite-songs", requestOptions);
            const result = await response.json();
            console.log(result, typeof result);
            setFavoriteSongs(result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFavoriteSongs();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause(); // Pause audio on unmount
            }
        };
    }, []);

    const playAudio = (url) => {
        if (audioRef.current) {
            audioRef.current.pause(); // Pause current audio if playing
        }

        audioRef.current = new Audio(url);
        audioRef.current.play();
        setCurrentAudio(url); // Set current audio URL
        setIsMusicPlay(true); // Set music playing state
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause(); // Pause the audio
            setIsMusicPlay(false); // Update music playing state
        }
    };

    return (
        <div className="favorite-songs-page">
            <h1>Your Favorite Songs</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : favoriteSongs.length === 0 ? (
                <div>No favorite songs found.</div>
            ) : (
                <div className="songs-container">
                    {favoriteSongs.map((song, index) => (
                        <div key={index} className="song-card">
                            <img src={song.image} alt={song.name} className="song-image" />
                            <h3>{song.name}</h3>
                            <p>{song.artist}</p>
                            {isMusicPlay && currentAudio === song.url ? (
                                <button className="submit-button" onClick={pauseAudio}>
                                    Pause
                                </button>
                            ) : (
                                <button className="submit-button" onClick={() => playAudio(song.url)}>
                                    Play
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteSongsPage;
