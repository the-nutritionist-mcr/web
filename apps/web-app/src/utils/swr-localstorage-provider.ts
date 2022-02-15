import { TNM_WEB_LOCALSTORAGE_KEY } from '../infrastructure/constants';
import { Hub } from 'aws-amplify';

export const swrLocalstorageProvider = () => {
  const map = new Map(
    JSON.parse(localStorage.getItem(TNM_WEB_LOCALSTORAGE_KEY) || '[]')
  );

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(TNM_WEB_LOCALSTORAGE_KEY, appCache);
  });

  Hub.listen('auth', (data) => {
    if (data.payload.event === 'signOut') {
      localStorage.removeItem(TNM_WEB_LOCALSTORAGE_KEY);
      map.clear();
    }
  });

  return map;
};
