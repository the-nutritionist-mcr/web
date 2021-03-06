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

export const getOutputs = async (): Promise<StackConfig> => {
  // TODO need to set FETCH_BASE_URL in deployed build
  const path = process.env.FETCH_BASE_URL
    ? `${process.env.FETCH_BASE_URL}/app-config.json`
    : `/app-config.json`;

  const outputs = await fetch(path);
  const json: StackOutputs = await outputs.json();

  const entries = Object.values(json);

  return entries.reduce<StackConfig>(
    (accum, value) => ({ ...accum, ...value }),
    {} as StackConfig
  );
};
