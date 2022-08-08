import { Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  gitHash: string;
  transient: boolean;
  chargebeeSite: string;
}

export interface BackendConfig {
  config: {
    UserpoolId: string;
    ClientId: string;
    UserPoolArn: string;
  };
  id: string;
}

export class BackendStack extends Stack {
  public pool: UserPool;
  public config: BackendConfig;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const { userPool, client } = makeUserPool(
      this,
      transient,
      props.envName,
      props.gitHash
    );

    this.config = {
      id,
      config: {
        UserPoolArn: userPool.userPoolArn,
        UserpoolId: userPool.userPoolId,
        ClientId: client.userPoolClientId,
      },
    };

    this.pool = userPool;
  }
}
