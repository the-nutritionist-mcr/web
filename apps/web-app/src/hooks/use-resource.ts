import toast from 'react-hot-toast';
import useSWR, { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';

interface Response<T> {
  items: T[];
}

type ExtractPromiseType<T> = T extends Promise<infer P> ? P : never;

export const useResource = <T extends { id: string }>(type: string) => {
  const { mutate, cache } = useSWRConfig();
  const { data: getData } = useSWR<Response<T>>(type, swrFetcher);

  const createItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'POST',
      body: JSON.stringify(input),
    });

  const [create] = useMutation(createItem, {
    onMutate({ input }: { input: T }) {
      const data = cache.get(type);
      const items = [...data.items, { ...input, id: '0' }];
      mutate(type, { items }, false);

      return () => {
        mutate(type, data, false);
      };
    },

    onSuccess({
      input,
      data,
    }: {
      input: T;
      data: ExtractPromiseType<ReturnType<typeof createItem>>;
    }) {
      const oldData = cache.get(type);
      const newData = {
        items: oldData.items.map((item: T) => {
          return item.id === '0' ? { ...input, id: data.id } : item;
        }),
      };

      mutate(type, newData, false);
      toast.success(`${type} created successfully`);
    },

    onFailure({ error }) {
      console.log(error);
      toast.error(`failed to create ${type}`);
    },
  });

  const updateItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'PUT',
      body: JSON.stringify(input),
    });

  const [update] = useMutation(updateItem, {
    onMutate({ input }: { input: T }) {
      const data = cache.get(type);
      const index = data.items.findIndex(
        (dataItem: T) => dataItem.id === input.id
      );
      data.items[index] = input;
      mutate(type, { items: data.items }, false);

      return () => {
        mutate(type, data, false);
      };
    },

    onSuccess() {
      toast.success(`${type} updated successfully`);
    },

    onFailure(error) {
      console.log(error);
      toast.error(`failed to update ${type}`);
    },
  });

  const removeItem = async <T extends { id: string }>(
    input: T
  ): Promise<void> => {
    await swrFetcher<T>(type, {
      method: 'PUT',
      body: JSON.stringify({ ...input, deleted: true }),
    });
  };

  const [remove] = useMutation(removeItem, {
    onMutate({ input }: { input: T }) {
      const data = cache.get(type);
      const items = data.items.filter(
        (dataItem: T) => dataItem.id !== input.id
      );
      mutate(type, { items }, false);

      return () => {
        mutate(type, data, false);
      };
    },

    onSuccess() {
      toast.success(`${type} removed successfully`);
    },

    onFailure(error) {
      console.log(error);
      toast.error(`failed to remove ${type}`);
    },
  });

  return { items: getData?.items, create, remove, update };
};
