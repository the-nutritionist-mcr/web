import { App } from 'aws-cdk-lib';
import { CHARGEBEE_SITES } from './constants';
import { UsersStack } from './permissions-stack';

import path from 'node:path';
import { BackendStack } from './backend-stack';
import { AccountUsersStack } from './account-users-stack';

const app = new App();

const account = process.env.IS_CDK_LOCAL ? '000000000000' : '568693217207';

const env = {
  account,
  region: 'eu-west-2',
};

const sesIdentityArn = `arn:aws:ses:us-east-1:568693217207:identity/thenutritionistmcr.com`;

const forceUpdateKey = 'force-update-key';

const main = async () => {
  const userStack = new AccountUsersStack(this, 'tnm-web-account-users-stack', {
    businessOwners: ['lawrence', 'jess', 'ryan'],
    developers: ['ben'],
    stackProps: { env },
  });

  /* eslint-disable unicorn/prefer-module */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const datadogCi = require('@datadog/datadog-ci');
  const gitHash = await datadogCi.gitMetadata.uploadGitCommitHash(
    process.env['DATADOG_API_KEY'],
    'datadoghq.eu'
  );

  new BackendStack(app, 'tnm-web-int-stack', {
    stackProps: { env },
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    envName: 'int',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new BackendStack(app, 'tnm-web-cypress-stack', {
    stackProps: { env },
    envName: 'cypress',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    gitHash,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new BackendStack(app, 'tnm-web-dev-stack', {
    stackProps: { env },
    envName: 'dev',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new BackendStack(app, 'tnm-web-test-stack', {
    stackProps: { env },
    envName: 'test',
    gitHash,
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new BackendStack(app, 'tnm-web-prod-stack', {
    stackProps: { env },
    envName: 'prod',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    gitHash,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new UsersStack(app, 'tnm-web-users-stack', {
    stackProps: { env },
  });
  app.synth();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => console.log(error));
