export const loader = ({
  src,
  width,
  quality,
}: {
  src: string,
  width: number,
  quality: number,
}) => {
  return `/images/${src}?width=${width}&quality=${quality}`;
};
