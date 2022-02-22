export const IAM = {
  actions: {
    cognito: {
      adminGetUser: 'cognito-idp:AdminGetUser',
      adminCreateUser: 'cognito-idp:AdminCreateUser',
      adminDeleteUser: 'cognito-idp:AdminDeleteUser',
      adminSetUserPassword: 'cognito-idp:AdminSetUserPassword',
    },
  },
} as const;
