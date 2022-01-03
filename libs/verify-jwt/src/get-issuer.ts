export const getIssuer = (): string => {
  const cognitoPoolId = process.env.COGNITO_POOL_ID ?? '';
  if (!cognitoPoolId) {
    throw new Error('COGNITO_POOL_ID not configured');
  }
  return `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${cognitoPoolId}`;
};
