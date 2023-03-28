import { getAuthenticatedGmailClient } from './get-authenticated-gmail-client';

export const deleteMessage = (params: { userId: string; id: string }) => {
  const gmail = getAuthenticatedGmailClient();
  return new Promise((accept, reject) => {
    gmail.users.messages.trash(params, (error, response) => {
      if (error) {
        reject(error);
      } else {
        accept(response);
      }
    });
  });
};
