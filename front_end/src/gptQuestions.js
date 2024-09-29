import React, { useState } from 'react';
import './Homepage.css';

const QuestionAnswerBox = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/generate_homepage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: question }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setAnswer(data.result);
                setError('');
            } else {
                setError(data.error);
                setAnswer('');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing your request');
            setAnswer('');
        }
    };


    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <label htmlFor="question" className= "h2">What would you like to know?</label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Enter your question here"
                            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                            />
                </div>
                <button type="submit" className= "submit-button">Submit</button>
            </form>
            {answer && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgb(42, 0, 65)' }}>
                    <h2>Answer:</h2>
                    <p>{answer}</p>
                </div>
            )}
            {error && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: 'rgb(42, 0, 65)' }}>
                    <h2>Error:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default QuestionAnswerBox;