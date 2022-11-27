import { KeyProps } from './key-props';

export const getProcessedKey = ({
  fileName,
  format,
  height,
  width,
  size,
  quality,
}: KeyProps) => {
  const sizeString = size ? [`size:${size}`] : [];
  const heightString = height ? [`height:${height}`] : [];
  const widthString = width ? [`width:${width}`] : [];
  const qualityString = quality ? [`quality:${quality}`] : [];

  const finalString = [
    ...sizeString,
    ...heightString,
    ...widthString,
    ...qualityString,
    `format:${format}`,
  ].join(':');

  return `processed/${fileName}/${finalString}`;
};
