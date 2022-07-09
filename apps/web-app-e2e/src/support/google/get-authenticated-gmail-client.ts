import { google } from 'googleapis';
import { ENV } from '@tnmw/constants';

const refreshToken = process.env[`NX_${ENV.varNames.GoogleRefreshToken}`];
const clientId = process.env[`NX_${ENV.varNames.GoogleClientId}`];
const clientSecret = process.env[`NX_${ENV.varNames.GoogleClientSecret}`];
const redirectUrl = process.env[`NX_${ENV.varNames.GoogleRedirectUrl}`];

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUrl
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});

export const getAuthenticatedGmailClient = () => {
  return google.gmail({ version: 'v1', auth: oauth2Client });
};
