import useSWR, { useSWRConfig } from 'swr';
import { getOutputs } from '../aws/get-outputs';
import { currentUser } from '../aws/authenticate';
import useMutation from 'use-mutation';
import { HTTP } from '../infrastructure/constants';

interface Response<T> {
  items: T[];
}

const getFetchInit = async (init?: RequestInit) => {
  const user = await currentUser();
  if(!user) {
    return {}
  }
  const {
    signInUserSession: {
      accessToken: { jwtToken }
    }
  } = user;

  const withToken = {
    headers: {
      authorization: jwtToken
    }
  };

  return init ? { ...init, ...withToken } : withToken;
}

const swrFetcher = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const { ApiDomainName: domainName } = await getOutputs();

  const finalInit = await getFetchInit(init)
  const fullPath = `https://${domainName}/${path}`
  const response = await fetch(fullPath, finalInit)

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(`Tried to make a request to ${fullPath} but the server returned a ${response.status} status code with the message "${data.error}"`)
    throw error
  }
  return await response.json()
};

type ExtractPromiseType<T> = T extends Promise<infer P> ? P : never;

export const useResource = <T extends { id: string }>(type: string) => {
  const { mutate, cache } = useSWRConfig();
  const { data: getData } = useSWR<Response<T>>(type, swrFetcher);

  const createItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'POST',
      body: JSON.stringify(input)
    });

  const [create] = useMutation(createItem, {
    onMutate({ input }: { input: T }) {
      console.log(input);
      const data = cache.get(type);
      const items = [...data.items, { ...input, id: 0 }];
      mutate(type, { items }, false);

      return () => {
        mutate(type, data, false);
      };
    },

    onSuccess({
      input,
      data
    }: {
      input: T;
      data: ExtractPromiseType<ReturnType<typeof createItem>>;
    }) {
      const oldData = cache.get(type);
      const newData = oldData.map((item: T) =>
        item.id === '0' ? { ...input, id: data.id } : item
      );
      mutate(type, newData, false);
    }
  });

  const updateItem = async <T extends { id: string }>(input: T): Promise<T> =>
    await swrFetcher<T>(type, {
      method: 'PUT',
      body: JSON.stringify(input)
    });

  const [update] = useMutation(updateItem, {
    onMutate({ input }: { input: T }) {
      const data = cache.get(type);
      const items = data.items.filter(
        (dataItem: T) => dataItem.id !== input.id
      );
      mutate(type, { items }, false);

      return () => {
        mutate(type, data, false);
      };
    }
  });

  const removeItem = async <T extends { id: string }>(
    input: T
  ): Promise<void> => {
    await swrFetcher<T>(type, {
      method: 'PUT',
      body: JSON.stringify({ ...input, deleted: true })
    });
  };

  const [remove] = useMutation(removeItem, {
    onMutate({ input }: { input: T }) {
      console.log(input);
      const data = cache.get(type);
      const items = data.items.filter(
        (dataItem: T) => dataItem.id !== input.id
      );
      mutate(type, { items }, false);

      return () => {
        mutate(type, data, false);
      };
    }
  });

  return { items: getData?.items, create, remove, update };
};
