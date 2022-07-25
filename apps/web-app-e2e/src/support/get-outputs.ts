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

  const entries = Object.entries(json);

  const found = entries.find(
    ([key]) => key.endsWith('-stack') && !key.endsWith('backend-stack')
  );

  return found[1];
};
