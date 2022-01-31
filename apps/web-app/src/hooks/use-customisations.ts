import useSWR, { mutate } from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

interface Response<T> {
  items: T[];
}

export const useResource = <T>(type: string) => {
  const { data } = useSWR<Response<T>>(type, swrFetcher);

  const create = async (item: T) => {
    mutate(type, { items: [...data.items, item] }, false)
    mutate(type, await swrFetcher(type, {
      method: 'POST',
      body: JSON.stringify(item)
    }))
  }

  return { data, create }
};
