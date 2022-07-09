import { google } from 'googleapis';
import { promisify } from 'node:util';

const getAuthenticatedGmailClient = () => {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUrl = process.env.GOOGLE_REDIRECT_URL;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
};

interface MessageResponse {
  data: {
    payload: {
      parts: { body: { data: string } }[];
    };
  };
}

export const getPasswordFromWelcomeEmail = async () => {
  const gmail = getAuthenticatedGmailClient();

  const listMessages = (params: { userId: string; q: string }) => {
    return new Promise((accept, reject) => {
      gmail.users.messages.list(params, (error, response) => {
        if (error) {
          reject(error);
        } else {
          accept(response);
        }
      });
    });
  };

  const getMessage = (params: { userId: string; id: string }) => {
    return new Promise<MessageResponse>((accept, reject) => {
      gmail.users.messages.get(params, (error, response) => {
        if (error) {
          reject(error);
        } else {
          accept(response);
        }
      });
    });
  };

  const response: any = await listMessages({
    userId: 'me',
    q: 'label:tnm-welcome-email',
  });

  const messagePromises = response.data.messages.map(async (message) => {
    const messageResponse = await getMessage({
      userId: 'me',
      id: message.id,
    });
    return messageResponse.data;
  });

  const messages = await Promise.all(messagePromises);

  console.log(
    messages
      .flatMap((message) =>
        message.payload.parts?.map((part) =>
          part.mimeType === 'text/html'
            ? Buffer.from(part.body.data, 'base64').toString('ascii')
            : undefined
        )
      )
      .filter(Boolean)
  );
};

getPasswordFromWelcomeEmail().catch((error) => console.log(error.message));
