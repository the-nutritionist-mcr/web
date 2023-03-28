import { JSDOM } from 'jsdom';
import { listMessages } from './list-messages';
import { getMessage } from './get-message';

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

export const getPasswordFromMostRecentWelcomeEmailThenDelete = async (
  to: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await listMessages({
    userId: 'me',
    q: `label:tnm-transactional to:${to}`,
  });

  if (!Array.isArray(response.data.messages)) {
    throw new TypeError('No results returned');
  }

  const messagePromises = response.data.messages.map(
    async (message: { id: string }) => {
      const messageResponse = await getMessage({
        userId: 'me',
        id: message.id,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (messageResponse as any).data;
    }
  );

  type Part = {
    mimeType: string;
    body: {
      data:
        | WithImplicitCoercion<string>
        | { [Symbol.toPrimitive](hint: 'string'): string };
    };
  };

  const messages = await Promise.all(messagePromises);

  const parsedMessages = messages
    .flatMap((message) => {
      return message.payload.parts?.map((part: Part) => {
        return part.mimeType === 'text/html'
          ? {
              body: Buffer.from(part.body.data, 'base64').toString('ascii'),
              id: message.id,
            }
          : undefined;
      });
    })
    // eslint-disable-next-line unicorn/prefer-array-find
    .filter(Boolean);

  const parsed = parsedMessages.map((message) => {
    const dom = new JSDOM(`<!DOCTYPE html>${message.body}`);

    const env = dom.window.document.querySelector('.environment');
    const password = dom.window.document.querySelector('.password');

    return {
      id: message.id,
      environment: extractTextArray(env)[0],
      password: extractTextArray(password)[0],
    };
  });

  const chosen = parsed[0];

  return chosen.password;
};

const delay = (time: number) => {
  return new Promise((accept) => setTimeout(accept, time));
};

export const pollForPasswordFromMostRecentWelcomeEmailThenDelete = async (
  email: string
): Promise<string> => {
  console.log('Polling inbox for welcome email...');

  try {
    const response = await getPasswordFromMostRecentWelcomeEmailThenDelete(
      email
    );
    console.log('welcome email found!');
    return response;
  } catch (error) {
    console.log(`Not found, waiting for 2 seconds: ${error.message}`);
    await delay(2000);
    return await pollForPasswordFromMostRecentWelcomeEmailThenDelete(email);
  }
};
