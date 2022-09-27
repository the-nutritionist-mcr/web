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

  type OnSuccessType = Exclude<
    Exclude<typeof options, undefined>['onSuccess'],
    undefined
  >;

  const success = (...args: Parameters<OnSuccessType>) => {
    options?.onSuccess?.(...args);
    if (getLoadingState() === 'Started') {
      stopLoading();
    }
  };

  const finalArgs = [
    key,
    fetcher,
    options,
    // { ...options, onSuccess: success },
  ] as const;

  const response = useSWR<SerialisedDate<T>>(...finalArgs);
  const { data, ...rest } = response;

  if (!response.isValidating) {
    stopLoading();
  }

  console.log(`response`, JSON.stringify(rest, null, 2));

  return {
    ...response,
    data: data && recursivelyDeserialiseDate<T>(data),
  };
};
