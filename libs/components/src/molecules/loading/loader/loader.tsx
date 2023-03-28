import { ReactNode, useContext } from 'react';
import { BeatLoader } from 'react-spinners';
import { LoadingContext } from '../loading';
import { loader, hide } from '../loading.css';

interface LoaderProps {
  children: ReactNode;
}

export const Loader = (props: LoaderProps) => {
  const { isLoading } = useContext(LoadingContext);
  console.log(`LOADING`, isLoading);
  return (
    <>
      <div
        className={`${loader}`}
        style={{ display: isLoading ? 'flex' : 'none' }}
      >
        <BeatLoader />
      </div>
      <div className={isLoading ? hide : ''}>{props.children}</div>
    </>
  );
};
