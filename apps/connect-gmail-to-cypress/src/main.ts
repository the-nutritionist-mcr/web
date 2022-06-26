import { google } from 'googleapis';
import express from 'express';
import open from 'open';

const app = express();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const port = process.env.port || 3333;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  `http://localhost:${port}/api`
);

app.get('/api', async (req, res) => {
  const { code } = req.query;

  if (typeof code === 'string') {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send({ tokens });
  }
});

const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

open(url);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
