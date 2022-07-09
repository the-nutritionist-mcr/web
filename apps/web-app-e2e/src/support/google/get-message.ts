import { getAuthenticatedGmailClient } from './get-authenticated-gmail-client';

export const getMessage = (params: { userId: string; id: string }) => {
  const gmail = getAuthenticatedGmailClient();
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
