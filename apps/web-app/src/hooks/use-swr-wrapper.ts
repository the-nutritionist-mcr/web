import { LoadingContext } from '@tnmw/components';
import { recursivelyDeserialiseDate, SerialisedDate } from '@tnmw/utils';
import { useContext } from 'react';
import useSWR, { Key, Middleware } from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

type ParamsType<T> = Parameters<typeof useSWR<SerialisedDate<T>>>;

const doStartLoading = (key: Key) => {
  if (typeof key === 'function') {
    try {
      key();
    } catch {
      return false;
    }
  }

  return Boolean(key);
};

export const useSwrWrapper = <T = unknown>(
  key: ParamsType<T>[0],
  options?: ParamsType<T>[2]
) => {
  const { useLoading } = useContext(LoadingContext);

  const finalKey = typeof key === 'function' ? key() : key;
  if (finalKey && typeof finalKey !== 'string') {
    throw new TypeError('useSwrWrapper can only be used with string keys');
  }

  const loadingKey = `swr-${finalKey}`;

  const { setLoadingState } = useLoading(loadingKey);

  const response = useSWR<SerialisedDate<T>>(key, swrFetcher, options);
  const { data, ...rest } = response;

  if (data !== undefined) {
    setLoadingState('Finished');
  }

  return {
    ...response,
    data: data && recursivelyDeserialiseDate<T>(data),
  };
};
