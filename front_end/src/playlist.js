import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './PlaylistPage.css';

const PlaylistPage = () => {
    const [playlists, setPlaylists] = useState([
        {
            playlist_name: 'My Playlist 1',
            songs: [
                { name: 'Song 1', artist: 'Artist 1', url: 'audio1.mp3' },
                { name: 'Song 2', artist: 'Artist 2', url: 'audio2.mp3' }
            ]
        },
        {
            playlist_name: 'My Playlist 2',
            songs: [
                { name: 'Song 3', artist: 'Artist 3', url: 'audio3.mp3' },
                { name: 'Song 4', artist: 'Artist 4', url: 'audio4.mp3' }
            ]
        }
    ]);

    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchPlaylists = async () => {
        try {
            const userId = localStorage.getItem("userId")
            const response = await fetch('http://localhost:3001/get_playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const openModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPlaylist(null);
    };

    const playAudio = (url) => {
        const audio = new Audio(url);
        audio.play();
    };

    return (
        <div className="playlist-page">
            <div className="header-container">
                <Link to="/" className="text-link"> <button className="login-button">Home</button></Link>
                
                <Link to="/disco" className="text-link"> <button className="login-button">Disco World</button>
                </Link>

                <Link to="/musical-career-game" className="text-link"> <button className="login-button">Music Career</button>
                </Link>
            </div>
            <h1>Your Playlists</h1>
            <div className="playlist-container">
                {playlists.map((playlist, index) => (
                    <div key={index} className="playlist-item" onClick={() => openModal(playlist)}>
                        {playlist.playlist_name}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedPlaylist.playlist_name}</h2>
                        <div className="songs-container">
                            {selectedPlaylist.songs.map((song, index) => (
                                <div key={index} className="song-card">
                                    <h3>{song.name}</h3>
                                    <p>{song.artist}</p>
                                    <button className="play-button" onClick={() => playAudio(song.url)}>
                                        ▶️
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="close-btn" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistPage;
