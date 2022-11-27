import sharp from 'sharp';
import { KeyProps } from './key-props';

export const getSharpStream = ({
  format,
  height,
  width,
  size,
  quality,
}: Omit<KeyProps, 'fileName'>) => {
  const options = quality ? { quality } : {};
  if (!height && width) {
    return sharp()
      .resize(width)
      .toFormat(format as 'jpeg', options);
  }

  if (size) {
    return sharp()
      .resize(size)
      .toFormat(format as 'jpeg', options);
  }

  return sharp()
    .resize(width, height)
    .toFormat(format as 'jpeg', options);
};
