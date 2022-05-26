type ValidExtension = 'pdf' | 'csv';

export const generateDatestampedFilename = (
  name: string,
  extension: ValidExtension
) => {
  const date = new Date();
  const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  return `${name}-${dateString}.${extension}`;
};
