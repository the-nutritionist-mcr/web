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
  process.env.FETCH_BASE_URL ?? '';

const path = `${urlNeededForTestingCosNodeFetchDoesntSupport}/app-config.json`;

const isBrowser = typeof window !== 'undefined';

const getOutputJson = async () => {
  if (isBrowser) {
    const promise = await fetch(path);
    return promise.json();
  }
  return {};
};

const jsonPromise = getOutputJson();

export const getOutputs = async (): Promise<StackConfig> => {
  return new Promise<StackConfig>((accept, reject) => {
    jsonPromise
      .then(async (json) => {
        const stackJson: StackOutputs = json;
        const entries = Object.values(stackJson);
        accept(
          entries.reduce<StackConfig>(
            (accum, value) => ({ ...accum, ...value }),
            {} as StackConfig
          )
        );
      })
      .catch((error) => reject(error));
  });
};
