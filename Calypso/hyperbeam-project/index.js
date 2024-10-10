const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS to allow requests from the frontend
app.use(cors());

// Constants
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const githubToken = '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'; // Your GitHub token

// In-memory cache to store Gist URL and timestamp
let gistUrl = null;

// Helper function to store session in GitHub Gist
async function storeSessionInGist(sessionUrl, timestamp) {
  try {
    const response = await axios.post(
      'https://api.github.com/gists',
      {
        description: 'Hyperbeam Session Data',
        public: false, // This makes the Gist private (only accessible via API)
        files: {
          'session.txt': {
            content: sessionUrl + "\n" + timestamp,
          },
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    const gistLink = response.data.html_url; // URL to retrieve the Gist
    console.log('Stored session in GitHub Gist:', gistLink);

    return gistLink; // Returns the GitHub Gist URL of the stored session
  } catch (error) {
    console.error('Error storing session in GitHub Gist:', error.response ? error.response.data : error.message);
    throw new Error('Failed to store session in GitHub Gist');
  }
}

// Helper function to get session from GitHub Gist
async function getSessionFromGist(gistUrl) {
  try {
    const gistId = gistUrl.split('/').pop(); // Extract the Gist ID from the URL
    const response = await axios.get(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const content = response.data.files['session.txt'].content;
    const [sessionUrl, timestamp] = content.split('\n'); // Split the raw data by line
    return { sessionUrl, timestamp };
  } catch (error) {
    console.error('Error retrieving session from GitHub Gist:', error.message);
    return null;
  }
}

// Helper function to create a new Hyperbeam session
async function createHyperbeamSession() {
  try {
    const response = await axios.post('https://engine.hyperbeam.com/v0/vm', {
      url: 'https://login.remotepc.com/rpcnew/home', // The VM will open RemotePC
      interactive: true,
    }, {
      headers: {
        'Authorization': `Bearer sk_live_5DKAdu5tOAwJmYiND_BGnP6r0gT6laMqL4tzqsmmiEU`, // Your Hyperbeam API key
        'Content-Type': 'application/json',
      },
    });

    return response.data.embed_url;
  } catch (error) {
    console.error('Error creating Hyperbeam session:', error.message);
    throw new Error('Failed to create Hyperbeam session');
  }
}

// Route to create or retrieve a cached Hyperbeam session
app.post('/create-session', async (req, res) => {
  try {
    // If we already have a Gist URL, retrieve the session from GitHub Gist
    if (gistUrl) {
      let cachedSession = await getSessionFromGist(gistUrl);
      const currentTime = new Date().getTime();

      // Check if the session is still valid (within 2 hours)
      if (cachedSession && currentTime - cachedSession.timestamp < CACHE_TTL) {
        console.log('Returning cached session');
        return res.json({ embed_url: cachedSession.sessionUrl, gistUrl });
      }
    }

    // Otherwise, create a new Hyperbeam session
    const newSessionUrl = await createHyperbeamSession();
    const newTimestamp = new Date().getTime();

    // Store the new session and timestamp in GitHub Gist
    gistUrl = await storeSessionInGist(newSessionUrl, newTimestamp);

    // Respond with the new session URL and Gist link
    res.json({ embed_url: newSessionUrl, gistUrl });
  } catch (error) {
    console.error('Error in session creation:', error.message);
    res.status(500).json({ error: 'Error creating session' });
  }
});

// Serve the app on the specified port
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
