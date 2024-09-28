const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = 3001; 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://jainamshah0428:${process.env.db_password}@girlhackscluster.3r5xk.mongodb.net/?retryWrites=true&w=majority&appName=girlhackscluster`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /generate_homepage and /reg_login_users endpoints.');
});

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

async function connection() {
    try {
        await client.connect();
        const database = client.db("userprofilesDB");
        const collection = database.collection("users");
        return { database, collection };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

app.post('/reg_login_users', async (req, res) => {
    const { collection } = await connection();
    
    const newUserProfile = {
        username: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        created: new Date()
    };

    const existingUser = await collection.findOne({ username: newUserProfile.username });
    const existingEmail = await collection.findOne({ email: newUserProfile.email });

    if (existingUser) {
        return res.status(400).json({ error: 'Username Already Exists' });
    } else if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
    } else {
        const result = await collection.insertOne(newUserProfile);
        return res.json({ message: `New user profile created with the following id: ${result.insertedId}` });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// // Test function for user registration
// async function generateResponse(userData) {
//     const response = await fetch('http://localhost:3000/reg_login_users', {

//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//     });
//     const data = await response.json();
//     return data;
// }

// // Example data to test user registration
// generateResponse({
//     username: "j.shah220",
//     firstname: "Jainam",
//     lastname: "Shah",
//     email: "jainamshah04129@gmail.com"
// })
// .then(result => console.log(result))
// .catch(error => console.error('Error:', error));
