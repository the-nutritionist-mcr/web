const services = {
  secretsManager: 'secretsmanager',
  dynamodb: 'dynamodb',
  ses: 'ses',
  cloudformation: 'cloudformation',
  cognito: 'cognito-idp',
} as const;

interface IAMType {
  actions: {
    [K in keyof typeof services]: {
      [key: string]: `${typeof services[K]}:${string}`;
    };
  };
}

export const IAM: IAMType = {
  actions: {
    secretsManager: {
      getSecret: 'secretsmanager:GetSecretValue',
    },
    dynamodb: {
      putItem: 'dynamodb:putItem',
    },
    ses: {
      sendEmail: 'ses:SendEmail',
    },
    cloudformation: {
      listStacks: 'cloudformation:ListStacks',
      listStar: 'cloudformation:List*',
      getStar: 'cloudformation:Get*',
      describeStar: 'cloudformation:Describe*',
    },
    cognito: {
      listUsers: 'cognito-idp:ListUsers',
      adminGetUser: 'cognito-idp:AdminGetUser',
      adminGetStar: 'cognito-idp:AdminGet*',
      adminListStar: 'cognito-idp:AdminList*',
      getStar: 'cognito-idp:Get*',
      describeStar: 'cognito-idp:Describe*',
      listStar: 'cognito-idp:List*',
      adminCreateUser: 'cognito-idp:AdminCreateUser',
      adminDeleteUser: 'cognito-idp:AdminDeleteUser',
      adminDisableUser: 'cognito-idp:AdminDisableUser',
      adminListGroupsForUser: 'cognito-idp:AdminListGroupsForUser',
      adminRemoveUserFromGroup: 'cognito-idp:AdminRemoveUserFromGroup',
      adminUserGlobalSignout: 'cognito-idp:AdminUserGlobalSignOut',
      adminSetUserPassword: 'cognito-idp:AdminSetUserPassword',
      adminUpdateUserAttributes: 'cognito-idp:AdminUpdateUserAttributes',
      adminAddUserToGroup: 'cognito-idp:AdminAddUserToGroup',
    },
  },
} as const;
