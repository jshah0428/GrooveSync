import React, { useState } from 'react';

export default function MusicalCareerGame() {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isGameActive, setIsGameActive] = useState(true);
  const [stage, setStage] = useState(0); // New state to track the stage of the game

  // Static data for the game options
  const staticOptions = {
    0: [
      "Join a rock band as a lead guitarist",
      "Start producing electronic dance music"
    ],
    1: [
      "Record a live album with a band",
      "Collaborate with a famous pop artist"
    ],
    2: [
      "Tour internationally as a headliner",
      "Compose music for a major film"
    ]
  };

  // Function to handle prompt submission and load the initial static options
  const handleSubmit = () => {
    setOptions(staticOptions[0]); // Load the initial options
    setSelectedOption(null);
    setStage(0); // Reset to the first stage
  };

  // Function to handle option selection and move to the next set of static options
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    if (stage < 2) {
      setStage(stage + 1); // Move to the next stage
      setOptions(staticOptions[stage + 1]); // Set the next options
    } else {
      // End the game when the last stage is reached
      setOptions([]);
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
      <h1>Musical Career Game</h1>

      {isGameActive && (
        <>
          {!selectedOption && (
            <div style={styles.inputSection}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                style={styles.input}
              />
              <button onClick={handleSubmit} style={styles.button}>
                Generate Options
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

          <button onClick={handleStop} style={styles.stopButton}>
            Stop
          </button>
        </>
      )}

      {!isGameActive && <p>Game Over. You stopped the game!</p>}
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
