import { ReactNode, useState, createContext } from 'react';
import { BeatLoader } from 'react-spinners';
import { loader, hide } from './loading.css';

interface LoadingProps {
  children: ReactNode;
}

type LoadingState = 'Started' | 'Finished';

interface LoadingHandles {
  [id: string]: LoadingState;
}

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (id: string) => void;
  stopLoading: (id: string) => void;
  getLoadingState: (id: string) => LoadingState | undefined;
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {
    // Noop
  },
  stopLoading: () => {
    // Noop
  },
  getLoadingState: () => undefined,
});

export const Loading = (props: LoadingProps) => {
  const [loadingHandles, setLoadingHandles] = useState<LoadingHandles>({
    'loading-component': 'Started',
  });

  const isLoading = Object.values(loadingHandles).includes('Started');

  const getLoadingState = (id: string): LoadingState | undefined => {
    return loadingHandles[id];
  };

  const startLoading = (id: string) => {
    console.debug(`Loading ${id}`);
    setLoadingHandles({
      ...loadingHandles,
      loadingComponent: 'Finished',
      [id]: 'Started',
    });
  };

  const stopLoading = (id: string) => {
    console.debug(`Finished loading ${id}`);
    setLoadingHandles({ ...loadingHandles, [id]: 'Finished' });
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, startLoading, stopLoading, getLoadingState }}
    >
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
