import { google } from 'googleapis';
import { JSDOM } from 'jsdom';

// Borrowed from here: https://github.com/jsdom/jsdom/issues/1245#issuecomment-861208443
function extractTextArray(node: ChildNode): string[] {
  const textLines: string[] = [];
  function stepThru(node: ChildNode): void {
    /* eslint-disable fp/no-loops */
    /* eslint-disable fp/no-let */
    for (let k = 0; k < node.childNodes.length; k++) {
      const x = node.childNodes[k];
      if (x.nodeType === node.TEXT_NODE) {
        const s = x.textContent?.trim();
        if (s) {
          // eslint-disable-next-line fp/no-mutating-methods
          textLines.push(s);
        }
      }
      stepThru(x);
    }
  }
  stepThru(node);
  return textLines;
}

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

export const getPasswordFromMostRecentWelcomeEmail = async () => {
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
    q: 'label:tnm-transactional',
  });

  const messagePromises = response.data.messages.map(async (message) => {
    const messageResponse = await getMessage({
      userId: 'me',
      id: message.id,
    });
    return messageResponse.data;
  });

  const messages = await Promise.all(messagePromises);

  const bodies = messages
    .flatMap((message) =>
      message.payload.parts?.map((part) =>
        part.mimeType === 'text/html'
          ? Buffer.from(part.body.data, 'base64').toString('ascii')
          : undefined
      )
    )
    // eslint-disable-next-line unicorn/prefer-array-find
    .filter(Boolean);

  const parsed = bodies.map((body) => {
    const dom = new JSDOM(`<!DOCTYPE html>${body}`);

    const env = dom.window.document.querySelector('.environment');
    const password = dom.window.document.querySelector('.password');

    return {
      environment: extractTextArray(env)[0],
      password: extractTextArray(password)[0],
    };
  });

  return parsed;
};

getPasswordFromMostRecentWelcomeEmail()
  .catch((error) => console.log(error.message))
  .then((result) => console.log(`Result: ${JSON.stringify(result, null, 2)}`));
