import { listMessages } from './list-messages';
import { deleteMessage } from './delete-message';

export const deleteAllCypressWelcomeEmails = async (to: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await listMessages({
    userId: 'me',
    q: `label:tnm-transactional to:${to}`,
  });

  if (Array.isArray(response.data.messages)) {
    const messagePromises = response.data.messages.map(async (message) =>
      deleteMessage({ userId: `me`, id: message.id })
    );
    await Promise.all(messagePromises);
  }

  return null;
};
