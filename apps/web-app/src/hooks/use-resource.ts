import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';
import { useSwrWrapper } from './use-swr-wrapper';

interface Response<T> {
  items: T[];
}

type ExtractPromiseType<T> = T extends Promise<infer P> ? P : never;

export const useResource = <T extends { id: string }>(
  type: string,
  ids?: string[]
) => {
  const { mutate, cache } = useSWRConfig();

  const getCache = <T extends { id: string }>(type: string) => {
    return cache.get(type) as {
      data: {
        items: T[];
      };
    };
  };

  const getType = () => {
    if (ids && ids.length === 0) {
      return false;
    }

    if (ids) {
      const deDupedIds = Array.from(new Set(ids));
      return `${type}/get-by-id?ids=${deDupedIds.join(',')}`;
    }

    return type;
  };

  const { data: getData } = useSwrWrapper<Response<T>>(getType);

  const createItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'POST',
      body: JSON.stringify(input),
    });

  const [create] = useMutation(createItem, {
    onMutate({ input }: { input: T }) {
      const { data } = getCache<T>(type);
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
      const { data: oldData } = getCache<T>(type);
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
      const { data } = getCache<T>(type);
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
      const { data } = cache;
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

  // if (!getData) {
  //   startLoading(loadingKey);
  // }

  // if (getData && isLoading) {
  //   stopLoading(loadingKey);
  // }

  return { items: getData?.items, create, remove, update };
};
