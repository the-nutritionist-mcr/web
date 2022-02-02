import useSWR, { mutate } from 'swr';
import { swrFetcher } from '../utils/swr-fetcher';

interface Response<T> {
  items: T[];
}

export const useResource = <T extends { id: string }>(type: string) => {
  const { data } = useSWR<Response<T>>(type, swrFetcher);

  const create = async (item: T) => {
    const items = [...data.items, item];

    mutate(type, { items }, false);

    const response = await swrFetcher<{ id: string }>(type, {
      method: 'POST',
      body: JSON.stringify(item),
    });

    item.id = response.id;
    mutate(type, { items }, false);
  };

  const remove = async (item: T) => {
    const items = data.items.filter((dataItem) => dataItem.id !== item.id);
    mutate(type, { items }, false);

    await swrFetcher(type, {
      method: 'PUT',
      body: JSON.stringify({ ...item, deleted: true }),
    });
  };

  const update = async (item: T) => {
    const items = data.items.map(mappedItem => item.id === mappedItem.id ? item : mappedItem)
    mutate(type, { items }, false);

    await swrFetcher(type, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  };

  return { data, create, remove, update };
};
