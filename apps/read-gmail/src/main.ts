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
