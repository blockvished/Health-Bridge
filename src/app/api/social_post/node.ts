import express from 'express';
import session from 'express-session';
import axios from 'axios';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: true }));

const CLIENT_ID = process.env.TWITTER_CLIENT_ID!;
const CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const AUTH_URL = 'https://twitter.com/i/oauth2/authorize';
const TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

// 1. Redirect users to Twitter OAuth 2.0 authorization
app.get('/auth/twitter', (req, res) => {
  const state = Math.random().toString(36).substring(2);
  const codeVerifier = Math.random().toString(36).substring(2);
  req.session.state = state;
  req.session.codeVerifier = codeVerifier;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'tweet.read tweet.write users.read offline.access media.write',
    state,
    code_challenge: codeVerifier,
    code_challenge_method: 'plain'
  });
  res.redirect(`${AUTH_URL}?${params.toString()}`);
});

// 2. Handle callback and exchange code for token
app.get('/auth/twitter/callback', async (req, res) => {
  const { code, state } = req.query as any;
  if (state !== req.session.state) return res.status(400).send('Invalid state');

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: req.session.codeVerifier,
  });

  try {
    const tokenRes = await axios.post(TOKEN_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    req.session.userToken = tokenRes.data.access_token;
    res.send('Authentication successful! You can now POST to /tweet');
  } catch (err: any) {
    res.status(500).send(`Token exchange failed: ${err.response?.data || err.message}`);
  }
});

// 3. Upload media and post tweet
app.post('/tweet', upload.single('image'), async (req, res) => {
  const userToken = req.session.userToken;
  if (!userToken) return res.status(401).send('Not authenticated');

  const text = req.body.text;
  const filePath = req.file.path;
  const mediaData = fs.readFileSync(filePath);

  try {
    // Upload media
    const uploadRes = await axios.post(
      'https://api.twitter.com/2/media/upload',
      mediaData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/octet-stream'
        }
      }
    );
    const mediaId = uploadRes.data.media_id;

    // Post tweet with media
    const tweetRes = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text, media: { media_ids: [mediaId] } },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Cleanup upload
    fs.unlinkSync(filePath);

    res.json(tweetRes.data);
  } catch (err: any) {
    res.status(500).send(`Error posting tweet: ${err.response?.data || err.message}`);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
