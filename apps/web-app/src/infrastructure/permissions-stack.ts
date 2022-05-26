import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { ManagedPolicy, User } from '@aws-cdk/aws-iam';

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

    const route53 = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonRoute53FullAccess'
    );

    const cloudfront = ManagedPolicy.fromAwsManagedPolicyName(
      'CloudFrontFullAccess'
    );

    const s3 = ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess');

    const cloudWatch = ManagedPolicy.fromAwsManagedPolicyName(
      'CloudWatchFullAccess'
    );

    const iamReadonly =
      ManagedPolicy.fromAwsManagedPolicyName('IAMReadOnlyAccess');

    const apiGateway = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonAPIGatewayAdministrator'
    );

    new User(this, 'ben', {
      managedPolicies: [
        apiGateway,
        iamReadonly,
        cognitoPowerUser,
        cloudWatch,
        ddbFull,
        billing,
        lambda,
        route53,
        cloudfront,
        s3,
      ],
      userName: 'ben',
    });
  }
}
