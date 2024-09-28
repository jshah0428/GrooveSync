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
        const collection2 = database.collection("playlist");
        return { database, collection, collection2 };
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


//this method will add songs AND create playlists(if you set the songs array to blank ([]))
app.post('/add_songs', async (req, res) => {
    const { collection2 } = await connection();
    
    const user_id = req.body.userId;
    const songs = req.body.songs; // This should be an array
    const playlist_name = req.body.playlist_name;

    if (!Array.isArray(songs)) {
        return res.status(400).json({ error: 'Songs must be an array' });
    }

    const addSongs = {
        user_id,
        songs,
        playlist_name,
    };

    for (const song of songs) {
        if (!song.name || !song.artist || !song.url) {
            return res.status(400).json({ error: 'Each song must have name, artist, and url' });
        }
    }

    try {
        const result = await collection2.updateOne(
            { user_id, playlist_name },
            { $push: { songs: { $each: songs } } },
            { upsert: true } 
        );

        return res.json({ message: `Songs added to playlist: ${playlist_name}`, result });
    } catch (error) {
        console.error('Error adding songs:', error);
        return res.status(500).json({ error: 'An error occurred while adding songs' });
    }
});


app.post('/get_playlists', async (req, res) => {
    const { collection2 } = await connection();
    const user_id = req.body.userId;

    try {
        const playlists = await collection2.find({ user_id }).toArray();

        if (playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for this user' });
        }

        // Map over the playlists to get the desired structure
        const response = playlists.map(playlist => ({
            playlist_name: playlist.playlist_name,
            songs: playlist.songs.map(song => ({
                name: song.name,      
                artist: song.artist,  
                url: song.url         
            }))
        }));

        return res.json(response); 
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({ error: 'An error occurred while fetching playlists' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


//testing to get songs.

// Test function for user registration
async function generateResponse(userData) {
    const response = await fetch('http://localhost:3001/get_playlists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    // Assuming response is successful, parse the JSON
    const data = await response.json();
    return data;
}

// Example data to test getting playlists
generateResponse({
    userId: "jainam",
})
.then(data => {
    // No need to call response.json() again
    data.forEach(playlist => {
        console.log(`Playlist: ${playlist.playlist_name}`);
        playlist.songs.forEach(song => {
            console.log(`Song: ${song.name}, Artist: ${song.artist}, URL: ${song.url}`);
        });
    });
})
.catch(error => console.error('Error:', error));

/*
get playlists
add songs

get songs in playlist(potentially own method)
*/

// generateResponse({
//     username: "j.shah220",
//     firstname: "Jainam",
//     lastname: "Shah",
//     email: "jainamshah04129@gmail.com"
// })
// .then(result => console.log(result))
// .catch(error => console.error('Error:', error));


// extra api key, not important
// app.post('/create_playlist', async (req, res)=>{
//     const { collection2 } = await connection();

    
//     const newPlayList = {
//         user_id: req.body.userId,
//         songs: [],
//         playlist_name: req.body.playlist_name,
//         created: new Date()
//     }

//     const existingPlaylist = await collection2.findOne({ playlist_name: newPlayList.playlist_name})

//     if (existingPlaylist){
//         return res.response(400).json({ error: "playlist name already exists"})
//     }else{
//         const result = await collection2.insertOne({newPlayList})
//         return res.json({ message: `New playlist named ${newPlayList.playlist_name} was created`})
//     }

// });