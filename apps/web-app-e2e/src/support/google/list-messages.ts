import { getAuthenticatedGmailClient } from './get-authenticated-gmail-client';

export const listMessages = (params: { userId: string; q: string }) => {
  const gmail = getAuthenticatedGmailClient();
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
