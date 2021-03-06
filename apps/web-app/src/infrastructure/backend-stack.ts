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
  }
}
