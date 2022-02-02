import { getOutputs } from '../aws/get-outputs';

export const swrFetcher = async <T>(
  ...args: Parameters<typeof fetch>
): Promise<T> => {
  const [path, ...rest] = args;
  const { ApiDomainName: domainName } = await getOutputs();
  const finalArgs: Parameters<typeof fetch> = [
    `https://${domainName}/${path}`,
    ...rest,
  ];
  return fetch(...finalArgs).then((res) => res.json());
};
