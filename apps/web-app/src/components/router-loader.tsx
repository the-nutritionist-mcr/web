import { LoadingContext } from '@tnmw/components';
import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';

interface RouterProps {
  children: ReactNode;
}

const LOADING_KEY = 'router';
export const RouterLoader = (props: RouterProps) => {
  const { startLoading, useLoading } = useContext(LoadingContext);
  const { stopLoading, resetLoading } = useLoading(LOADING_KEY, true);

  const router = useRouter();

  useEffect(() => {
    const handleStart = (path: string, config: { shallow: boolean }) => {
      if (!config.shallow) {
        resetLoading();
        startLoading(LOADING_KEY);
      }
    };

    const handleStop = () => {
      console.log('finished router');
      stopLoading();
    };
    router?.events?.on('routeChangeStart', handleStart);
    router?.events?.on('routeChangeComplete', handleStop);

    return () => {
      router?.events?.off('routeChangeStart', handleStart);
      router?.events?.off('routeChangeComplete', handleStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return <>{props.children}</>;
};
