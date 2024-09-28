const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = 3000; 

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});
app.use(express.json());

app.post('/generate_homepage', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const anthropicResponse = await anthropic.completions.create({
            model: "claude-2.1",
            prompt: `Human: ${prompt}\n\nAssistant:`,
            max_tokens_to_sample: 100,
            temperature: 1
        });

        res.json({ result: anthropicResponse.completion });
    
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// async function generateResponse(prompt) {
//     const response = await fetch('http://localhost:3000/generate_homepage', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//     });
//     const data = await response.json();
//     return data.result;
// }

// generateResponse("Tell me about famous disco musicians")
//     .then(result => console.log(result))
//     .catch(error => console.error('Error:', error));