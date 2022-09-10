import { Stack, StackProps } from 'aws-cdk-lib';
import { Group, IGroup, ManagedPolicy, User } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface AccountUsersStackProps {
  businessOwners: string[];
  developers: string[];
  stackProps: StackProps;
}

const billing = ManagedPolicy.fromAwsManagedPolicyName('job-function/Billing');

export class AccountUsersStack extends Stack {
  public businessOwnersGroup: IGroup;
  public developersGroup: IGroup;

  constructor(scope: Construct, id: string, props: AccountUsersStackProps) {
    super(scope, id, props.stackProps);

    const readOnlyAccess =
      ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');

    const cognitoPowerUser = ManagedPolicy.fromAwsManagedPolicyName(
      'AmazonCognitoPowerUser'
    );

    this.businessOwnersGroup = new Group(this, 'tnm-web-business-owner-group', {
      groupName: 'tnm-web-business-owner',
    });

    props.businessOwners.forEach(
      (owner) =>
        new User(this, `${owner}-user`, {
          groups: [this.businessOwnersGroup],
          managedPolicies: [readOnlyAccess, billing, cognitoPowerUser],
          userName: owner,
        })
    );

    this.developersGroup = new Group(this, 'tnm-web-developers-group', {
      groupName: 'tnm-web-developer',
    });

    props.developers.forEach(
      (developer) =>
        new User(this, `${developer}-user`, {
          groups: [this.developersGroup],
          managedPolicies: [readOnlyAccess],
          userName: developer,
        })
    );
  }
}
