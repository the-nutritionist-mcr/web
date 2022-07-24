import { E2E } from '@tnmw/constants';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  transient: boolean;
  chargebeeSite: string;
}

export class BackendStack extends Stack {
  public pool: UserPool;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const { userPool } = makeUserPool(this, transient, props.envName);

    this.pool = userPool;

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
                Value: E2E.testCustomer.deliveryDay1,
              },
              {
                Name: 'custom:deliveryDay2',
                Value: E2E.testCustomer.deliveryDay2,
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
  }
}
