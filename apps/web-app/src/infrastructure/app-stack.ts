import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import path from 'node:path';
import { deployStatics } from './deploy-statics';
import { makeDataApis } from './make-data-apis';
import { makePagesApi } from './make-pages-api';
import { makeUserPool } from './make-user-pool';
import { setupFrontDoor } from './setup-front-door';

interface TnmAppProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
}

// eslint-disable-next-line unicorn/prefer-module
const packageRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(packageRoot, '..', '..');

export class AppStack extends Stack {
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
            groups: ['admin'],
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
      client,
      props.forceUpdateKey
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
      props.chargebeeSite,
      props.forceUpdateKey
    );
  }
}
