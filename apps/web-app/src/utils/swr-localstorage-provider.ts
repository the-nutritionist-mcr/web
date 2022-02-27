import { TNM_WEB_LOCALSTORAGE_KEY } from '../infrastructure/constants';
import { Hub } from 'aws-amplify';

export const swrLocalstorageProvider = () => {
  const map = new Map(
    JSON.parse(localStorage.getItem(TNM_WEB_LOCALSTORAGE_KEY) || '[]')
  );

  const clearAll = () => {
    localStorage.removeItem(TNM_WEB_LOCALSTORAGE_KEY);
    map.clear();
  }

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(TNM_WEB_LOCALSTORAGE_KEY, appCache);
  });

  Hub.listen('auth', (data) => {
    if(data.payload.event === 'signIn') {
      const currentUsername = localStorage.getItem(TNM_WEB_LOCALSTORAGE_KEY)
      const username = data.payload.data.username

      if(username !== currentUsername) {
        clearAll()
        localStorage.setItem(TNM_WEB_LOCALSTORAGE_KEY, username)
      }
    }
  });

  Hub.listen('auth', (data) => {
    if (data.payload.event === 'signOut') {
      clearAll()
    }
  });

  return map;
};
