import { Stack, StackProps } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import { makeUserPool } from './make-user-pool';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { makeDataApis } from './make-data-apis';
import { IGroup } from 'aws-cdk-lib/aws-iam';
import { getDomainName } from '@tnmw/utils';
import { IHostedZone, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { CognitoSeeder } from '@tnmw/seed-cognito';
import { SEED_USERS } from './seed-users';

interface BackendStackProps {
  forceUpdateKey: string;
  stackProps: StackProps;
  envName: string;
  gitHash: string;
  transient: boolean;
  chargebeeSite: string;
  sesIdentityArn: string;
  developerGroup: IGroup;
}

export class BackendStack extends Stack {
  public pool: UserPool;
  public zone: IHostedZone;

  public constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props.stackProps);
    const transient = props.envName !== 'prod';

    const { userPool } = makeUserPool(
      this,
      transient,
      props.envName,
      props.gitHash
    );

    if (props.transient) {
      new CognitoSeeder(this, `cognito-seeder`, {
        userpool: userPool,
        users: SEED_USERS,
      });
    }

    const domainName = getDomainName(props.envName);

    const hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });

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
  }
}
