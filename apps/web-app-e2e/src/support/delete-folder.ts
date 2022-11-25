import { rmdir } from 'node:fs';

export const deleteFolder = (folderName: string) => {
  console.log('deleting folder %s', folderName);

  return new Promise((resolve, reject) => {
    rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
      if (err) {
        console.error(err);

        return reject(err);
      }

      resolve(null);
    });
  });
};
