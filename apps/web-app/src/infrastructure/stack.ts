import { App } from 'aws-cdk-lib';
import { AppStack } from './app-stack';
import { CHARGEBEE_SITES } from './constants';
import { UsersStack } from './permissions-stack';

import path from 'node:path';
import { BackendStack } from './backend-stack';

// eslint-disable-next-line unicorn/prefer-module
const root = path.join(__dirname, '../../../..');
const dist = path.join(root, 'dist');

const nextJsBuildDir = path.join(dist, 'apps', 'web-app', 'serverless');

const app = new App();

const account = process.env.IS_CDK_LOCAL ? '000000000000' : '568693217207';

const env = {
  account,
  region: 'us-east-1',
};

const sesIdentityArn = `arn:aws:ses:us-east-1:568693217207:identity/thenutritionistmcr.com`;

const forceUpdateKey = 'force-update-key';

const main = async () => {
  /* eslint-disable unicorn/prefer-module */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const datadogCi = require('@datadog/datadog-ci');
  const gitHash = await datadogCi.gitMetadata.uploadGitCommitHash(
    process.env['DATADOG_API_KEY'],
    'datadoghq.eu'
  );

  const backendStack = new BackendStack(app, 'tnm-web-int-backend-stack', {
    stackProps: { env },
    envName: 'int',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-int-stack', {
    stackProps: { env },
    backendConfig: backendStack.config,
    gitHash,
    envName: 'int',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    sesIdentityArn,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: backendStack.pool,
  });

  const intStack = new BackendStack(app, 'tnm-web-cypress-backend-stack', {
    stackProps: { env },
    envName: 'cypress',
    transient: true,
    gitHash,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-cypress-stack', {
    stackProps: { env },
    gitHash,
    envName: 'cypress',
    backendConfig: intStack.config,
    transient: true,
    sesIdentityArn,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: intStack.pool,
  });

  const devStack = new BackendStack(app, 'tnm-web-dev-backend-stack', {
    stackProps: { env },
    envName: 'dev',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-dev-stack', {
    stackProps: { env },
    envName: 'dev',
    gitHash,
    backendConfig: devStack.config,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
    sesIdentityArn,
    userPool: devStack.pool,
    nextJsBuildDir,
  });

  const testStack = new BackendStack(app, 'tnm-web-test-backend-stack', {
    stackProps: { env },
    envName: 'test',
    gitHash,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-test-stack', {
    stackProps: { env },
    envName: 'test',
    transient: true,
    backendConfig: testStack.config,
    gitHash,
    chargebeeSite: CHARGEBEE_SITES.test,
    sesIdentityArn,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: testStack.pool,
  });

  const prodStack = new BackendStack(app, 'tnm-web-prod-backend-stack', {
    stackProps: { env },
    envName: 'prod',
    gitHash,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-prod-stack', {
    stackProps: { env },
    envName: 'prod',
    gitHash,
    transient: false,
    chargebeeSite: CHARGEBEE_SITES.live,
    sesIdentityArn,
    backendConfig: prodStack.config,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: prodStack.pool,
  });

  new UsersStack(app, 'tnm-web-users-stack', {
    stackProps: { env },
  });
  app.synth();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => console.log(error));
