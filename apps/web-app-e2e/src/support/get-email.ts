import { google } from 'googleapis';

export const getEmail = async (
  username: string,
  password: string,
  server: string,
  port: number,
  subject: string
) => {
  const gmail = google.gmail({
    version: 'v1',
    auth: 'AIzaSyD40KK9d76DDAREj4EMBCr5P9sHE8W3nCo',
  });

  const response = await gmail.users.messages.list({
    userId: 'me',
  });

  console.log(response);
};

getEmail(
  'ben@thenutritionistmcr.com',
  'LQkx8FVf',
  'imap.gmail.com',
  993,
  'TNM Invite'
);
