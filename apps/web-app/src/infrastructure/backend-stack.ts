import { getDomainName } from '@tnmw/utils';
import { Stack, StackProps } from 'aws-cdk-lib';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { ISource, Source } from 'aws-cdk-lib/aws-s3-deployment';
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
  public client: UserPoolClient;
  public source: ISource;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const { userPool, client } = makeUserPool(
      this,
      transient,
      props.envName,
      props.gitHash
    );

    const config = {
      one: {
        DomainName: getDomainName(props.envName),
        ApiDomainName: getDomainName(props.envName, 'api'),
      },
      two: {
        UserPoolId: userPool.userPoolId,
        ClientId: client.userPoolClientId,
        UserPoolArn: userPool.userPoolArn,
      },
    };

    this.source = Source.jsonData('app-config.json', config);
    this.client = client;
    this.pool = userPool;
  }
}
