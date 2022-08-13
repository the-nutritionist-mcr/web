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
  const outputs = await fetch('/app-config.json');
  const json: StackOutputs = await outputs.json();

  console.log(json);

  const entries = Object.entries(json);

  return entries.reduce<StackConfig>(
    (accum, value) => ({ ...accum, ...value }),
    {} as StackConfig
  );
};
