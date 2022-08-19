import { ReactNode, useState, createContext } from 'react';

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

const LOADING_KEY = 'loading-component';

export const Loading = (props: LoadingProps) => {
  const [loadingHandles, setLoadingHandles] = useState<LoadingHandles>({
    [LOADING_KEY]: 'Started',
  });

  const isLoading = Object.values(loadingHandles).includes('Started');

  console.log(JSON.stringify({ loadingHandles, isLoading }));

  const getLoadingState = (id: string): LoadingState | undefined => {
    return loadingHandles[id];
  };

  const startLoading = (id: string) => {
    console.log(`Loading ${id}`);
    if (!isLoading) {
      console.log('already finished loading');
      return;
    }
    setLoadingHandles({
      ...loadingHandles,
      [LOADING_KEY]: 'Finished',
      [id]: 'Started',
    });
  };

  const stopLoading = (id: string) => {
    console.log(`Finished loading ${id}`);
    if (!isLoading) {
      return;
    }
    setLoadingHandles({
      ...loadingHandles,
      [LOADING_KEY]: 'Finished',
      [id]: 'Finished',
    });
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, startLoading, stopLoading, getLoadingState }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};
