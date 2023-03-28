import { Stack, StackProps } from 'aws-cdk-lib';
import { IUserPoolClient, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { makeDataApis } from './make-data-apis';
import { getDomainName } from '@tnmw/utils';
import { IHostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  gitHash: string | undefined;
  transient: boolean;
  seed: boolean;
  chargebeeSite: string;
  sesIdentityArn: string;
}

export class BackendStack extends Stack {
  public pool: UserPool;
  public zone: IHostedZone;
  public client: IUserPoolClient;
  public recipesTable: ITable;
  public customisationsTable: ITable;

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
      props.gitHash
    );

    const { recipesTable, customisationsTable } = makeDataApis(
      this,
      props.envName,
      userPool,
      hostedZone,
      props.gitHash,
      props.sesIdentityArn,
      props.chargebeeSite,
      props.forceUpdateKey
    );

    this.recipesTable = recipesTable;
    this.customisationsTable = customisationsTable;
    this.zone = hostedZone;
    this.pool = userPool;
    this.client = client;
  }
}
