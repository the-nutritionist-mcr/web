import { StackConfig } from '@tnmw/types';

const urlNeededForTestingCosNodeFetchDoesntSupport =
  process.env['FETCH_BASE_URL'] ?? '';

const path = `${urlNeededForTestingCosNodeFetchDoesntSupport}/app-config.json`;

const isBrowser = typeof window !== 'undefined';

const getOutputJson = async () => {
  if (isBrowser) {
    const promise = await fetch(path);
    return promise.json();
  }
  return {};
};

// eslint-disable-next-line fp/no-let
let outputJson: Awaited<ReturnType<typeof getOutputJson>> | undefined;

export const getAppConfig = async (): Promise<StackConfig> => {
  if (!outputJson) {
    outputJson = await getOutputJson();
  }

  return outputJson;
};
