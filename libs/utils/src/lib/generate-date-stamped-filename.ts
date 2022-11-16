type ValidExtension = 'pdf' | 'csv' | 'zip';

export const generateDatestampedFilename = (
  name: string,
  extension: ValidExtension
) => {
  const date = new Date();
  const dateString = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return `${name}-${dateString}.${extension}`;
};
