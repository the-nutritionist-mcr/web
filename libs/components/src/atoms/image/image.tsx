interface ImageProps {
  srcWebp: string;
  srcFallback: string;
  className?: string;
  alt: string;
}
export const Image = (props: ImageProps) => {
  return (
    <picture>
      <source
        srcSet={props.srcWebp}
        type="image/webp"
        className={props.className}
      />
      <source
        srcSet={props.srcFallback}
        type="image/jpeg"
        className={props.className}
      />
      <img
        src={props.srcFallback}
        alt="Plates of TNM food"
        className={props.className}
      />
    </picture>
  );
};
