import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { CfnAppMonitor } from 'aws-cdk-lib/aws-rum';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { getDomainName } from '@tnmw/utils';
import { getResourceName } from './get-resource-name';

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
