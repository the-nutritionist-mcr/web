export type StackConfig = {
  UserPoolId: string;
  AuthUrl: string;
  ClientId: string;
  RedirectUrl: string;
  DomainName: string;
  ApiDomainName: string;
};

type StackOutputs = {
  [stackName: string]: StackConfig;
};

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
  const stackJson: StackOutputs = outputJson;
  const entries = Object.values(stackJson);

  return entries.reduce<StackConfig>(
    (accum, value) => ({ ...accum, ...value }),
    {} as StackConfig
  );
};
