import { App } from 'aws-cdk-lib';
import { AppStack } from './app-stack';
import { CHARGEBEE_SITES } from './constants';
import { UsersStack } from './permissions-stack';

import { Builder } from '@sls-next/lambda-at-edge';
import path from 'node:path';

const nextJsBuildDir = '../../dist/apps/web-app/sls-build';

// eslint-disable-next-line unicorn/prefer-module
const dirname = __dirname;

const root = path.join(dirname, '../../../..');
const dist = path.join(root, 'dist');
const nextConfigDir = path.join(dist, 'apps', 'web-app');
const slsBuildOutput = path.join(dist, 'apps', 'web-app', 'serverless');

const builder = new Builder(nextConfigDir, slsBuildOutput, {
  cmd: 'true',
  cwd: root,
  cleanupDotNext: false,
});

builder
  .build(true)
  .then(() => {
    const app = new App();

    const account = process.env.IS_CDK_LOCAL ? '000000000000' : '568693217207';

    const env = {
      account,
      region: 'us-east-1',
    };

    const forceUpdateKey = 'force-update-key';

    new AppStack(app, 'tnm-web-int-stack', {
      stackProps: { env },
      envName: 'int',
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
      forceUpdateKey,
      nextJsBuildDir,
    });

    new AppStack(app, 'tnm-web-cypress-stack', {
      stackProps: { env },
      envName: 'cypress',
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
      forceUpdateKey,
      nextJsBuildDir,
    });

    new AppStack(app, 'tnm-web-dev-stack', {
      stackProps: { env },
      envName: 'dev',
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
      forceUpdateKey,
      nextJsBuildDir,
    });

    new AppStack(app, 'tnm-web-test-stack', {
      stackProps: { env },
      envName: 'test',
      transient: true,
      chargebeeSite: CHARGEBEE_SITES.test,
      forceUpdateKey,
      nextJsBuildDir,
    });

    new AppStack(app, 'tnm-web-prod-stack', {
      stackProps: { env },
      envName: 'prod',
      transient: false,
      chargebeeSite: CHARGEBEE_SITES.test,
      forceUpdateKey,
      nextJsBuildDir,
    });

    new UsersStack(app, 'tnm-web-users-stack', {
      stackProps: { env },
    });

    app.synth();
  })
  .catch((error) => console.log(error));
