import { App } from 'aws-cdk-lib';
import { CHARGEBEE_SITES } from './constants';
import { UsersStack } from './permissions-stack';

import { BackendStack } from './backend-stack';
import { AccountUsersStack } from './account-users-stack';
import { FrontendStack } from './frontend-stack';

const app = new App();

const gitHash = async (): Promise<string | undefined> => {
  /* eslint-disable unicorn/prefer-module */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const datadogCi = require('@datadog/datadog-ci');

  const key = process.env['DATADOG_API_KEY'];
  if (!key) {
    return undefined;
  }
  return await datadogCi.gitMetadata.uploadGitCommitHash(key, 'datadoghq.eu');
};

const account = process.env.IS_CDK_LOCAL ? '000000000000' : '568693217207';

const env = {
  account,
  region: 'eu-west-2',
};

const sesIdentityArn = `arn:aws:ses:eu-west-2:568693217207:identity/thenutritionistmcr.com`;

const forceUpdateKey = 'force-update-key';

const main = async () => {
  const userStack = new AccountUsersStack(app, 'tnm-web-account-users-stack', {
    businessOwners: ['lawrence', 'jess', 'ryan'],
    developers: ['ben'],
    stackProps: { env },
  });

  const hash = await gitHash();

  interface StackConfig {
    transient: boolean;
    chargebeeSite: string;
  }

  const stacks: { [key: string]: StackConfig } = {
    local: {
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
    },
    int: {
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
    },

    test: {
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
    },

    cypress: {
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
    },

    dev: {
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
    },

    prod: {
      transient: false,
      chargebeeSite: CHARGEBEE_SITES.live,
    },
  };

  Object.entries(stacks).forEach(([envName, config]) => {
    const backend = new BackendStack(app, `tnm-web-${envName}-stack`, {
      stackProps: { env },
      sesIdentityArn,
      developerGroup: userStack.developersGroup,
      businessOwnersGroup: userStack.businessOwnersGroup,
      envName,
      transient: config.transient,
      chargebeeSite: config.chargebeeSite,
      gitHash: hash,
      forceUpdateKey,
    });

    new FrontendStack(app, `tnm-web-${envName}-frontend-stack`, {
      stackProps: { env },
      envName,
      transient: config.transient,
      hostedZone: backend.zone,
      poolClient: backend.client,
      userPool: backend.pool,
    });
  });

  new UsersStack(app, 'tnm-web-users-stack', {
    stackProps: { env },
  });
  app.synth();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => console.log(error));
