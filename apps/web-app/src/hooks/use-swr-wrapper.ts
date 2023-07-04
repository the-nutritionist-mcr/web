import { LoadingContext } from '@tnmw/components';
import { recursivelyDeserialiseDate, SerialisedDate } from '@tnmw/utils';
import { useContext } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

type ParamsType<T> = Parameters<typeof useSWR<SerialisedDate<T>>>;

export const useSwrWrapper = <T = unknown>(
  key: ParamsType<T>[0],
  options?: ParamsType<T>[2],
  useLoader?: boolean
) => {
  const { useLoading } = useContext(LoadingContext);

  const finalKey = typeof key === 'function' ? key() : key;
  if (finalKey && typeof finalKey !== 'string') {
    throw new TypeError('useSwrWrapper can only be used with string keys');
  }

  const loadingKey = `swr-${finalKey}`;

  const { stopLoading, getLoadingState, setLoadingState } = useLoading(
    loadingKey,
    !finalKey || !useLoader
  );

  type OnErrorType = Exclude<
    Exclude<typeof options, undefined>['onError'],
    undefined
  >;

  const error = (...args: Parameters<OnErrorType>) => {
    options?.onError?.(...args);
    if (getLoadingState() === 'Started') {
      stopLoading();
    }
  };

  const refreshInterval = options?.refreshInterval ?? 5000;

  const finalArgs = [
    key,
    swrFetcher,
    { ...options, onerror: error, refreshInterval },
  ] as const;

  const response = useSWR<SerialisedDate<T>>(...finalArgs);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, ...rest } = response;

  if (data !== undefined) {
    setLoadingState('Finished');
  }

  return {
    ...response,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: data && recursivelyDeserialiseDate<T>(data),
  };
};
