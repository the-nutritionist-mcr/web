import { getOutputs } from './get-outputs';

export const getPoolConfig = async () => {
  const json = await getOutputs();
  const { ApiDomainName, ...rest } = json;

  return rest;
};
