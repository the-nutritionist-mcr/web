export const IAM = {
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
      adminCreateUser: 'cognito-idp:AdminCreateUser',
      adminDeleteUser: 'cognito-idp:AdminDeleteUser',
      adminSetUserPassword: 'cognito-idp:AdminSetUserPassword',
      adminUpdateUserAttributes: 'cognito-idp:AdminUpdateUserAttributes',
      adminAddUserToGroup: 'cognito-idp:AdminAddUserToGroup',
    },
  },
} as const;
