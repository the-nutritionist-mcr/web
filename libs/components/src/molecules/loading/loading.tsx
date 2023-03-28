import {
  ReactNode,
  useState,
  createContext,
  useLayoutEffect,
  useEffect,
} from 'react';

interface LoadingProps {
  children: ReactNode;
}

type LoadingState = 'Started' | 'Finished';

interface LoadingHandles {
  [id: string]: LoadingState;
}

interface LoadingContextType {
  isLoading: boolean;
  useLoading: (id: string, dontStart?: boolean) => UseLoadingReturn;
  startLoading: (id: string) => void;
  getLoadingState: (id: string) => LoadingState | undefined;
}

interface UseLoadingReturn {
  stopLoading: () => void;
  getLoadingState: () => LoadingState | undefined;
  resetLoading: () => void;
  setLoadingState: (state: LoadingState) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startLoading: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getLoadingState: () => {
    return undefined;
  },

  useLoading: () => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stopLoading: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setLoadingState: () => {},
      getLoadingState: () => 'Started',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      resetLoading: () => {},
    };
  },
});

// eslint-disable-next-line fp/no-let
let loadingHandles: LoadingHandles = {};

const layoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const LOADING_KEY = 'loading-handler';

export const Loading = (props: LoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);

  console.log(JSON.stringify(loadingHandles, null, 2));

  const startLoading = (id: string) => {
    console.debug(`Started loading '${id}'`);
    loadingHandles[id] = 'Started';
    setIsLoading(true);
  };

  const useLoading = (key: string, dontStart?: boolean) => {
    layoutEffect(() => {
      if (!dontStart) {
        console.log('start!', dontStart);
        startLoading(key);
      }
    }, [key]);

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const resetLoading = () => {
      loadingHandles = {};
    };

    const setLoadingState = (state: LoadingState) => {
      loadingHandles[key] = state;

      const isLoadingReally =
        Object.values(loadingHandles).includes('Started') &&
        Object.values(loadingHandles).length > 0;
      console.debug(`${key}: ${state}`);

      setIsLoading(isLoadingReally);
    };

    const stopLoading = () => {
      console.debug(`Finished loading '${key}'`);
      loadingHandles[key] = 'Finished';

      const isLoadingReally =
        Object.values(loadingHandles).includes('Started') &&
        Object.values(loadingHandles).length > 0;
      console.debug(JSON.stringify(loadingHandles, null, 2));

      setIsLoading(isLoadingReally);
    };

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const getLoadingState = (): LoadingState | undefined => {
      return loadingHandles[key];
    };

    return { stopLoading, getLoadingState, resetLoading, setLoadingState };
  };

  const { stopLoading } = useLoading(LOADING_KEY);

  useEffect(() => {
    stopLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLoadingState = (id: string): LoadingState | undefined => {
    return loadingHandles[id];
  };

  return (
    <LoadingContext.Provider
      value={{ startLoading, useLoading, isLoading, getLoadingState }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};
