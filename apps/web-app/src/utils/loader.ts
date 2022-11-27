export const loader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  if (quality) {
    return `/images/${src}?width=${width}&quality=${quality}`;
  }
  return `/images/${src}?width=${width}`;
};
