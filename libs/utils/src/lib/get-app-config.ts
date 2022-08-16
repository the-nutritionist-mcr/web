import { StackConfig } from '@tnmw/types';

const urlNeededForTestingCosNodeFetchDoesntSupport =
  process.env['FETCH_BASE_URL'] ?? '';

const CONFIG_FILE = `app-config.json`;

const path = `${urlNeededForTestingCosNodeFetchDoesntSupport}/${CONFIG_FILE}`;

const isBrowser = typeof window !== 'undefined';

const getOutputJson = async (path: string) => {
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
    try {
      outputJson = await getOutputJson(path);
    } catch {
      try {
        console.error(
          `Could not find app config on current domain, reverting to cypress config`
        );
        outputJson = await getOutputJson(
          `https://cypress.app.thenutritionistmcr.com/${CONFIG_FILE}`
        );
      } catch {
        outputJson = JSON.parse(
          `{"UserPoolId":"eu-west-2_77z37j3Fb","ClientId":"gefuduan1mfq083dc2gr8b3","ApiDomainName":"api.cypress.app.thenutritionistmcr.com","DomainName":"cypress.app.thenutritionistmcr.com","AwsRegion":"eu-west-2"}`
        );
      }
    }
  }

  return outputJson;
};
