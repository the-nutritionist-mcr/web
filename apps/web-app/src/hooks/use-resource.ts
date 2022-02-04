import useSWR, { useSWRConfig } from 'swr';
import { getOutputs } from '../aws/get-outputs';
import { currentUser } from '../aws/authenticate';

interface Response<T> {
  items: T[];
}

const swrFetcher = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const { ApiDomainName: domainName } = await getOutputs();

  const user = await currentUser();
  const {
    signInUserSession: {
      accessToken: { jwtToken },
    },
  } = user;

  const withToken = {
    headers: {
      authorization: jwtToken,
    },
  };

  const finalInit = init ? { ...init, ...withToken } : withToken;

  const response = await fetch(`https://${domainName}/${path}`, finalInit).then((res) =>
    res.json()
  );
  return response
};

export const useResource = <T extends { id: string }>(type: string) => {
  const { mutate } = useSWRConfig()
  const { data } = useSWR<Response<T>>(type, swrFetcher);

  const create = async (item: T) => {
    const items = [...(data?.items ?? []), item];

    mutate(type, { items }, {
      optimisticData: items,
    });

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
    const items = data.items.map((mappedItem) =>
      item.id === mappedItem.id ? item : mappedItem
    );
    mutate(type, { items }, false);

    await swrFetcher(type, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  };

  return { items: data?.items, create, remove, update };
};
