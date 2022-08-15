import { ReactNode, useState, createContext } from 'react';
import { BeatLoader } from 'react-spinners';
import { loader, hide } from './loading.css';

interface LoadingProps {
  children: ReactNode;
}

interface LoadingHandles {
  [id: string]: boolean;
}

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (id: string) => void;
  stopLoading: (id: string) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const Loading = (props: LoadingProps) => {
  const [loadingHandles, setLoadingHandles] = useState<LoadingHandles>({});

  const isLoading = Object.entries(loadingHandles).length > 0;

  const startLoading = (id: string) => {
    console.log(`start ${id}`);
    setLoadingHandles({ ...loadingHandles, [id]: true });
  };

  const stopLoading = (id: string) => {
    console.log(`stop ${id}`);
    const newLoadingHandles = { ...loadingHandles };
    delete newLoadingHandles[id];
    setLoadingHandles(newLoadingHandles);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      <div
        className={`${loader}`}
        style={{ display: isLoading ? 'flex' : 'none' }}
      >
        <BeatLoader />
      </div>
      <div className={isLoading ? hide : ''}>{props.children}</div>
    </LoadingContext.Provider>
  );
};
