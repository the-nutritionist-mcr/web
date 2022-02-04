#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import BackendStack from './backend-stack';
import ProductionFrontendStack from './production-frontend-stack';

const generateStacks = (): void => {
  const app = new cdk.App();

  const account = process.env.IS_LOCALSTACK ? '000000000000' : '661272765443';

  const defaults = {
    env: {
      region: 'us-east-1',
      account,
    },
    appName: 'tnm-admin',
    domainName: 'tnm-admin.com',
    friendlyName: 'The TNM Admin app',
  };

  const details = {
    prod: {
      ...defaults,
      stackLabel: 'ProductionFrontendStackProd',
      envName: 'prod',
      subdomain: 'www',
      url: 'https://www.tnm-admin.com',
      transient: false,
    },
    test: {
      ...defaults,
      stackLabel: 'ProductionFrontendStackTest',
      envName: 'test',
      subdomain: 'test',
      url: 'https://test.tnm-admin.com',
      transient: false,
    },
    dev: {
      stackLabel: 'ProductionFrontendStackDev',
      ...defaults,
      envName: 'dev',
      subdomain: 'dev',
      url: 'https://dev.tnm-admin.com',
      transient: false,
    },
  };

  Object.entries(details).forEach(([key, config]) => {
    new BackendStack(app, `DevBackendStack${key}`, config);
    new ProductionFrontendStack(app, config.stackLabel, config);
  });

  new BackendStack(app, `tnm-ci-backend-stack`, {
    envName: 'ci',
    ...defaults,
    url: 'https://ci.tnm-admin.com',
    transient: true,
  });

  new BackendStack(app, `tnm-int-backend-stack`, {
    envName: 'int',
    ...defaults,
    url: 'https://int.tnm-admin.com',
    transient: true,
  });

  new BackendStack(app, `tnm-local-backend-stack`, {
    envName: 'local',
    ...defaults,
    url: 'https://local.tnm-admin.com',
    transient: true,
  });
};

export default generateStacks;
