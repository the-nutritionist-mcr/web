import { Stack, StackProps } from 'aws-cdk-lib';
import { IUserPoolClient, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { makeDataApis } from './make-data-apis';
import { DynamoDBSeeder, Seeds } from '@cloudcomponents/cdk-dynamodb-seeder';
import { getDomainName } from '@tnmw/utils';
import { IHostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { recipes } from './seed-data/recipes';
import { exclusions } from './seed-data/exclusions';

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

    if (props.seed && !props.transient) {
      new DynamoDBSeeder(this, 'seed-recipes', {
        table: recipesTable,
        seeds: Seeds.fromInline(recipes),
      });

      new DynamoDBSeeder(this, 'seed-customisations', {
        table: customisationsTable,
        seeds: Seeds.fromInline(exclusions),
      });
    }

    this.zone = hostedZone;
    this.pool = userPool;
    this.client = client;
  }
}
