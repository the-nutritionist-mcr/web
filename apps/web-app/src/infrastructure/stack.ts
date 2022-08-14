import { App } from 'aws-cdk-lib';
import { AppStack } from './app-stack';
import { CHARGEBEE_SITES } from './constants';
import { UsersStack } from './permissions-stack';

import path from 'node:path';
import { BackendStack } from './backend-stack';
import { AccountUsersStack } from './account-users-stack';

// eslint-disable-next-line unicorn/prefer-module
const root = path.join(__dirname, '../../../..');
const dist = path.join(root, 'dist');

const nextJsBuildDir = path.join(dist, 'apps', 'web-app', 'serverless');

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

  const backendStack = new BackendStack(app, 'tnm-web-int-backend-stack', {
    stackProps: { env },
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    envName: 'int',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-int-stack', {
    stackProps: { env },
    gitHash,
    envName: 'int',
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    hostedZone: backendStack.zone,
    userPool: backendStack.pool,
    sesIdentityArn,
    forceUpdateKey,
    nextJsBuildDir,
    developerGroup: userStack.developersGroup,
  });

  const intStack = new BackendStack(app, 'tnm-web-cypress-backend-stack', {
    stackProps: { env },
    envName: 'cypress',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    gitHash,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-cypress-stack', {
    stackProps: { env },
    gitHash,
    envName: 'cypress',
    transient: true,
    sesIdentityArn,
    chargebeeSite: CHARGEBEE_SITES.test,
    hostedZone: intStack.zone,
    forceUpdateKey,
    userPool: intStack.pool,
    nextJsBuildDir,
    developerGroup: userStack.developersGroup,
  });

  const devStack = new BackendStack(app, 'tnm-web-dev-backend-stack', {
    stackProps: { env },
    envName: 'dev',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    gitHash,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-dev-stack', {
    stackProps: { env },
    envName: 'dev',
    gitHash,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    hostedZone: devStack.zone,
    forceUpdateKey,
    sesIdentityArn,
    userPool: devStack.pool,
    nextJsBuildDir,
    developerGroup: userStack.developersGroup,
  });

  const testStack = new BackendStack(app, 'tnm-web-test-backend-stack', {
    stackProps: { env },
    envName: 'test',
    gitHash,
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-test-stack', {
    stackProps: { env },
    envName: 'test',
    transient: true,
    gitHash,
    hostedZone: testStack.zone,
    chargebeeSite: CHARGEBEE_SITES.test,
    sesIdentityArn,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: testStack.pool,
    developerGroup: userStack.developersGroup,
  });

  const prodStack = new BackendStack(app, 'tnm-web-prod-backend-stack', {
    stackProps: { env },
    envName: 'prod',
    sesIdentityArn,
    developerGroup: userStack.developersGroup,
    gitHash,
    transient: true,
    chargebeeSite: CHARGEBEE_SITES.test,
    forceUpdateKey,
  });

  new AppStack(app, 'tnm-web-prod-stack', {
    stackProps: { env },
    envName: 'prod',
    gitHash,
    hostedZone: prodStack.zone,
    transient: false,
    chargebeeSite: CHARGEBEE_SITES.live,
    sesIdentityArn,
    forceUpdateKey,
    nextJsBuildDir,
    userPool: prodStack.pool,
    developerGroup: userStack.developersGroup,
  });

  new UsersStack(app, 'tnm-web-users-stack', {
    stackProps: { env },
  });
  app.synth();
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => console.log(error));
