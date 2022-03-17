import { App, Stack, StackProps, Construct } from '@aws-cdk/core';
import * as path from 'node:path';
import { makeUserPool } from './make-user-pool';
import { makePagesApi } from './make-pages-api';
import { setupFrontDoor } from './setup-front-door';
import { deployStatics } from './deploy-statics';
import { makeDataApis } from './make-data-apis';
import { CHARGEBEE_SITES } from './constants';
import { CognitoSeeder } from '@tnmw/seed-cognito';

interface TnmAppProps {
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
}

// eslint-disable-next-line unicorn/prefer-module
const packageRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');

class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: TnmAppProps) {
    super(scope, id, props.stackProps);

    const transient = props.envName !== 'prod';

    const { userPool, client } = makeUserPool(this, transient, props.envName);

    if (transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: userPool,
        users: [
          {
            username: 'cypress-test-user',
            password: 'Cypress-test-password-1',
            email: 'cypress@test.com',
            state: 'Complete',
          },
          {
            username: 'cypress-test-user-two',
            password: 'Cypress-test-password-2',
            email: 'cypress2@test.com',
            state: 'Complete',
          },
        ],
      });
    }

    const { httpOrigin } = makePagesApi(
      this,
      path.resolve(packageRoot, 'out_lambda'),
      props.envName,
      path.resolve(repoRoot, 'dist', 'apps', 'web-app', '.next'),
      userPool,
      client
    );

    const { distribution, hostedZone } = setupFrontDoor(
      this,
      props.envName,
      httpOrigin
    );

    deployStatics(this, props.envName, distribution);

    makeDataApis(
      this,
      hostedZone,
      props.envName,
      userPool,
      props.chargebeeSite
    );
  }
}

const app = new App();

const account = process.env.IS_CDK_LOCAL ? '000000000000' : '568693217207';

const env = {
  account,
  region: 'eu-west-2',
};

new AppStack(app, 'tnm-web-int-stack', {
  stackProps: { env },
  envName: 'int',
  transient: true,
  chargebeeSite: CHARGEBEE_SITES.test,
});

new AppStack(app, 'tnm-web-cypress-stack', {
  stackProps: { env },
  envName: 'cypress',
  transient: true,
  chargebeeSite: CHARGEBEE_SITES.test,
});

new AppStack(app, 'tnm-web-dev-stack', {
  stackProps: { env },
  envName: 'dev',
  transient: true,
  chargebeeSite: CHARGEBEE_SITES.test,
});

new AppStack(app, 'tnm-web-test-stack', {
  stackProps: { env },
  envName: 'test',
  transient: true,
  chargebeeSite: CHARGEBEE_SITES.test,
});

new AppStack(app, 'tnm-web-prod-stack', {
  stackProps: { env },
  envName: 'prod',
  transient: false,
  chargebeeSite: CHARGEBEE_SITES.test,
});

app.synth();
