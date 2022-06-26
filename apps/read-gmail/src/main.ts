import { google } from 'googleapis';

const clientId = process.env.GOOGLE_CLIENT_ID;

const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  'http://localhost:3333/api'
);

client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: client });

gmail.users.messages.list(
  { userId: 'me', q: 'label:tnm-welcome-email' },
  (error, response) => {
    response.data.messages.map((message) => console.log(message.payload));
    if (error) {
      console.log(error.message);
    } else {
      console.log(response.data.messages);
    }
  }
);
