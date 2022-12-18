import { rmdir } from 'node:fs';

export const deleteFolder = async (folderName: string) => {
  console.log('deleting folder %s', folderName);

  try {
    await new Promise((resolve, reject) => {
      rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
        if (err) {
          console.error(err);

          return reject(err);
        }

        resolve(null);
      });
    });
  } catch (error) {
    if (!error.message.includes('ENOENT')) {
      throw error;
    }
  }
};
