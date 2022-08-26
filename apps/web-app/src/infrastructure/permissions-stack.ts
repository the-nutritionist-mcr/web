import { Stack, StackProps } from 'aws-cdk-lib';
import { ManagedPolicy, User, Group } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface PermsStackProps {
  stackProps: StackProps;
}

export class UsersStack extends Stack {
  constructor(scope: Construct, id: string, props: PermsStackProps) {
    super(scope, id, props.stackProps);

    const cognitoPowerUser = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonCognitoPowerUser'
    );

    const ddbFull = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonDynamoDBFullAccess'
    );

    const billing = ManagedPolicy.fromAwsManagedPolicyName(
      'job-function/Billing'
    );

    const lambda = ManagedPolicy.fromAwsManagedPolicyName(
      'AWSLambda_FullAccess'
    );

    const s3 = ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess');

    const apiGateway = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonAPIGatewayAdministrator'
    );

    const readOnlyAccess =
      ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');

    new User(this, 'ben', {
      managedPolicies: [
        apiGateway,
        readOnlyAccess,
        cognitoPowerUser,
        ddbFull,
        billing,
        lambda,
        s3,
      ],
      userName: 'ben',
    });

    const businessOwnerGroup = new Group(this, 'tnm-business-owner-group', {
      groupName: 'tnm-business-owner',
      managedPolicies: [billing, readOnlyAccess, cognitoPowerUser],
    });

    new User(this, 'lawrence-user', {
      groups: [businessOwnerGroup],
      userName: 'lawrence',
    });
  }
}
