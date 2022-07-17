import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import path from 'node:path';
import { deployStatics } from './deploy-statics';
import { makeDataApis } from './make-data-apis';
import { makePagesApi } from './make-pages-api';
import { makeUserPool } from './make-user-pool';
import { setupFrontDoor } from './setup-front-door';
import { E2E } from '@tnmw/constants';

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
            otherAttributes: [
              {
                Name: 'given_name',
                Value: 'Cypress',
              },

              {
                Name: 'family_name',
                Value: 'Tester',
              },
            ],

            username: E2E.adminUserOne.username,
            password: E2E.adminUserOne.password,
            email: E2E.adminUserOne.email,
            state: 'Complete',
            groups: ['admin'],
          },
          {
            otherAttributes: [
              {
                Name: 'given_name',
                Value: 'Cypress',
              },

              {
                Name: 'family_name',
                Value: 'Tester2',
              },
            ],
            username: E2E.normalUserOne.username,
            password: E2E.normalUserOne.password,
            email: E2E.normalUserOne.email,
            state: 'Complete',
          },
          {
            otherAttributes: [
              {
                Name: 'given_name',
                Value: E2E.testCustomer.firstName,
              },
              {
                Name: 'family_name',
                Value: E2E.testCustomer.surname,
              },
              {
                Name: 'custom:plans',
                Value: E2E.testCustomer.plans,
              },
              {
                Name: 'custom:deliveryDay1',
                Value: 'Monday',
              },
              {
                Name: 'custom:deliveryDay2',
                Value: 'Wednesday',
              },
            ],
            username: E2E.testCustomer.username,
            password: E2E.testCustomer.password,
            email: E2E.testCustomer.email,
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
