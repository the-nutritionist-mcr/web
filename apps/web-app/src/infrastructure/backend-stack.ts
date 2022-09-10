import { Stack, StackProps } from 'aws-cdk-lib';
import { IUserPoolClient, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { makeDataApis } from './make-data-apis';
import { IGroup } from 'aws-cdk-lib/aws-iam';
import { getDomainName } from '@tnmw/utils';
import { IHostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import path from 'node:path';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  gitHash: string | undefined;
  transient: boolean;
  chargebeeSite: string;
  sesIdentityArn: string;
  developerGroup: IGroup;
  businessOwnersGroup: IGroup;
}

export class BackendStack extends Stack {
  public pool: UserPool;
  public zone: IHostedZone;
  public client: IUserPoolClient;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const domainName = getDomainName(props.envName);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });

    const { userPool, client } = makeUserPool(
      this,
      transient,
      props.envName,
      props.gitHash,
      props.businessOwnersGroup
    );

    makeDataApis(
      this,
      props.envName,
      userPool,
      hostedZone,
      props.gitHash,
      props.sesIdentityArn,
      props.chargebeeSite,
      props.forceUpdateKey,
      props.developerGroup
    );

    this.zone = hostedZone;
    this.pool = userPool;
    this.client = client;
  }
}
