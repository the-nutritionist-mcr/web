import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import useMutation from 'use-mutation';
import { swrFetcher } from '../utils/swr-fetcher';
import { useSwrWrapper } from './use-swr-wrapper';

interface Response<T> {
  items: T[];
  count: number;
}

type ExtractPromiseType<T> = T extends Promise<infer P> ? P : never;

export const useResource = <
  T extends { id: string },
  P extends readonly (keyof T)[] | undefined = undefined
>({
  type,
  idsOrSearchTerm,
  projection,
  page,
}: {
  type: string;
  idsOrSearchTerm?: string[] | string;
  projection?: P;
  page?: number;
}) => {
  const { mutate, cache } = useSWRConfig();

  type R = P extends readonly (keyof T)[] ? Pick<T, P[number]> : T;

  const getCache = <T extends { id: string }>(type: string) => {
    const response = cache.get(type) as
      | {
          data: {
            items: T[];
          };
        }
      | undefined;

    if (!response) {
      return { data: undefined };
    }

    return response;
  };

  const getType = () => {
    const pageString = page ? `&page=${page}` : ``;

    if (typeof projection !== 'undefined') {
      return `${type}?projection=${projection?.join(',')}${pageString}`;
    }

    if (typeof idsOrSearchTerm === 'string') {
      return `${type}/search?searchTerm=${idsOrSearchTerm}`;
    }

    if (Array.isArray(idsOrSearchTerm) && idsOrSearchTerm.length === 0) {
      return false;
    }

    if (idsOrSearchTerm) {
      const deDupedIds = Array.from(new Set(idsOrSearchTerm));
      return `${type}/get-by-id?ids=${deDupedIds.join(',')}`;
    }

    const typePageString = page ? `?page=${page}` : ``;
    return `${type}${typePageString}`;
  };

  const { data: getData } = useSwrWrapper<Response<R>>(
    getType,
    {},
    typeof idsOrSearchTerm !== 'string' && !page
  );

  const createItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'POST',
      body: JSON.stringify(input),
    });

  const [create] = useMutation(createItem, {
    onMutate({ input }: { input: T }) {
      const { data } = getCache<T>(type);
      const items = [...(data?.items ?? []), { ...input, id: '0' }];
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
        items: oldData?.items.map((item: T) => {
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
      const index = data?.items.findIndex(
        (dataItem: T) => dataItem.id === input.id
      );
      if (data && index) {
        data.items[index] = input;
      }
      mutate(type, { items: data?.items }, false);
      mutate(`${type}/get-by-id?ids=${input.id}`);

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
      const { data } = getCache<T>(type);
      const items = data?.items.filter(
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

  return {
    items: getData?.items,
    count: getData?.count,
    create,
    remove,
    update,
  };
};
