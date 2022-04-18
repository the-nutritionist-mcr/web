export const IAM = {
  actions: {
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
