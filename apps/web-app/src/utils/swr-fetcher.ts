import { getOutputs } from '../aws/get-outputs';

export const swrFetcher = async (...args: Parameters<typeof fetch>) => {
  const [path, ...rest] = args;
  const { ApiDomainName: domainName } = await getOutputs();
  const finalArgs: Parameters<typeof fetch> = [
    `https://${domainName}/${path}`,
    ...rest,
  ];
  return fetch(...finalArgs).then((res) => res.json());
};
