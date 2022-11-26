import fs from 'node:fs';
import path from 'node:path';
import pdf from 'pdf-parse';

export const readPdf = async (pathToPdf: string) => {
  const resolvedPath = path.resolve(pathToPdf);
  const data = fs.readFileSync(resolvedPath);
  const { text } = await pdf(data);

  return text;
};
