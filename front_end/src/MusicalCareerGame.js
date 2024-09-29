import React, { useState } from 'react';
import Loader from './loader';
import { Link } from 'react-router-dom';

export default function MusicalCareerGame() {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState([]);
  const [story, setStory] = useState(''); // New state to store the combined story
  const [isGameActive, setIsGameActive] = useState(true);
  const [stage, setStage] = useState(0); // Track the stage of the game
  const [selectedOption, setSelectedOption] = useState(null); // Added state to track selected option
  const [loading, setLoading] = useState(false); // New state for loading status


  // Function to handle prompt submission and fetch options from OpenAI
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response1 = await fetch('http://localhost:3001/generate_homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Start a story ${prompt} for 3 lines` }),
      });
      const data1 = await response1.json();

      const response2 = await fetch('http://localhost:3001/generate_homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Continue the story : ${prompt}` }),
      });
      const data2 = await response2.json();

      // Set the options based on the responses from OpenAI
      setOptions([data1.result, data2.result]);
      setStory(`Story: ${data1.result} `); // Start the story
      setStage(1); // Set stage to 1
      setSelectedOption(null); // Reset selected option
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
    }
    finally {
      setLoading(false); // Set loading to false regardless of the outcome
    }

  };

  // Function to handle option selection and merge it into the story
  const handleOptionSelect = (option) => {
    setStory((prev) => `${prev} ${option}`); // Merge the selected option into the story
    setStage((prev) => prev + 1); // Increment the stage

    // Fetch new options for the next stage
    if (stage < 4) {
      // Fetch new options for the next stage
      fetchNewOptions(prompt);
    } else {
      // End the game when the last stage is reached
      setOptions([]);
      setIsGameActive(false); // End the game
    }
  };

  // Function to fetch new options based on the current stage
  const fetchNewOptions = async (artist) => {
    setLoading(true);
    try {
      const response1 = await fetch('http://localhost:3001/generate_homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Make any story ${artist}` }),
      });
      const data1 = await response1.json();

      const response2 = await fetch('http://localhost:3001/generate_homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Make any story ${artist}` }),
      });
      const data2 = await response2.json();

      // Set the new options based on the responses
      setOptions([data1.result, data2.result]);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
    } finally {
      setLoading(false); // Set loading to false regardless of the outcome
    }
  };

  // Function to stop the game
  const handleStop = () => {
    setIsGameActive(false);
    setOptions([]);
    setSelectedOption(null);
  };

  return (
    <div className="game-container" style={styles.container}>
      <div className="header-container">
        <Link to="/" className="text-link"> <button className="login-button">Home</button></Link>
        
        <Link to="/disco" className="text-link"> <button className="login-button">Disco World</button>
        </Link>

        <Link to="/playlist" className="text-link"> <button className="login-button">Playlist</button>
        </Link>
      </div>
      
      <Loader loading={loading} />
      <h1 className='z-10'>Creat A Musical Story</h1>
      {isGameActive && (
        <>
          {!options.length && !selectedOption && (
            <div style={styles.inputSection}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the prompt to start a story"
                style={styles.input}
              />
              <button onClick={handleSubmit} style={styles.button} disabled={loading}>
                {loading ? 'Loading...' : 'Generate Options'}
              </button>
            </div>
          )}

          {options.length > 0 && (
            <div style={styles.optionsSection}>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  style={styles.optionButton}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <p>{story}</p>

          <button onClick={handleStop} style={styles.stopButton}>
            Stop
          </button>
        </>
      )}

      {!isGameActive && <p>Game Over. Your final story: {story}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
  },
  inputSection: {
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    width: '60%',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#6200ea',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  optionsSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '20px 0',
  },
  optionButton: {
    padding: '10px 20px',
    backgroundColor: '#03a9f4',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  stopButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
