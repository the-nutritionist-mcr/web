import { LoadingContext } from '@tnmw/components';
import { recursivelyDeserialiseDate, SerialisedDate } from '@tnmw/utils';
import { useContext } from 'react';
import useSWR, { Middleware } from 'swr';

export const useSwrWrapper = <T = unknown>(
  ...args: Parameters<typeof useSWR<SerialisedDate<T>>>
) => {
  const { useLoading } = useContext(LoadingContext);
  const [key, fetcher, options] = args;

  const finalKey = typeof key === 'function' ? key() : key;
  if (finalKey && typeof finalKey !== 'string') {
    throw new TypeError('useSwrWrapper can only be used with string keys');
  }

  const loadingKey = `swr-${finalKey}`;

  const { stopLoading, getLoadingState } = useLoading(loadingKey);

  type OnErrorType = Exclude<
    Exclude<typeof options, undefined>['onError'],
    undefined
  >;

  type OnSuccessType = Exclude<
    Exclude<typeof options, undefined>['onSuccess'],
    undefined
  >;

  const error = (...args: Parameters<OnErrorType>) => {
    options?.onError?.(...args);
    if (getLoadingState() === 'Started') {
      stopLoading();
    }
  };

  const success = (...args: Parameters<OnSuccessType>) => {
    options?.onSuccess?.(...args);
    if (getLoadingState() === 'Started') {
      stopLoading();
    }
  };

  const finalArgs = [
    key,
    fetcher,
    { ...options, onError: error, onSuccess: success },
  ] as const;

  const response = useSWR<SerialisedDate<T>>(...finalArgs);
  const { data, ...rest } = response;

  if (!response.isValidating) {
    stopLoading();
  }

  return {
    ...response,
    data: data && recursivelyDeserialiseDate<T>(data),
  };
};
