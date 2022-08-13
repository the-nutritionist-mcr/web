/* eslint-disable fp/no-throw */
/* eslint-disable no-console */

import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const TEST_USER = 'cypress-test-user-2';
export const TEST_USER_2 = 'cypress-test-user-3';

const USER_DOES_NOT_EXIST = 'User does not exist.';

export const seedCognito = async (
  poolId: string,
  email: string,
  password: string,
  registerUser: string,
  testUserEmail: string,
  testPassword: string
) => {
  const cognito = new CognitoIdentityServiceProvider({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  if (!email) {
    throw new Error('CYPRESS_TEST_USER_NAME not configured');
  }

  if (!password) {
    throw new Error('CYPRESS_TEST_USER_INITIAL_PASSWORD not configured');
  }

  if (!registerUser) {
    throw new Error('CYPRESS_TEST_REGISTER_USER not configured');
  }

  if (!poolId) {
    throw new Error('CYPRESS_POOL_ID not configured');
  }

  try {
    console.log(`Deleting ${TEST_USER} from ${poolId}`);
    await cognito
      .adminDeleteUser({
        UserPoolId: poolId,
        Username: TEST_USER,
      })
      .promise();
  } catch (error) {
    if (error.message !== USER_DOES_NOT_EXIST) {
      throw error;
    }
    console.log(`Did not delete ${TEST_USER} because the user didn't exist`);
  }
  try {
    console.log(`Deleting ${registerUser} from ${poolId}`);
    await cognito
      .adminDeleteUser({
        UserPoolId: poolId,
        Username: registerUser,
      })
      .promise();
  } catch (error) {
    if (error.message !== USER_DOES_NOT_EXIST) {
      // eslint-disable-next-line fp/no-throw
      throw error;
    }
    console.log(`Did not delete ${registerUser} because the user didn't exist`);
  }

  try {
    console.log(`Deleting ${TEST_USER_2} from ${poolId}`);
    await cognito
      .adminDeleteUser({
        UserPoolId: poolId,
        Username: TEST_USER_2,
      })
      .promise();
  } catch (error) {
    if (error.message !== USER_DOES_NOT_EXIST) {
      // eslint-disable-next-line fp/no-throw
      throw error;
    }
    console.log(`Did not delete ${TEST_USER_2} because the user didn't exist`);
  }

  const params = {
    UserPoolId: poolId,
    Username: TEST_USER,
    TemporaryPassword: password,
    MessageAction: 'SUPPRESS',
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'phone_number_verified',
        Value: 'True',
      },
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: '+447732432435',
      },
    ],
  };

  console.log(`Seeding ${poolId} with:`, JSON.stringify(params, null, 2));
  await cognito.adminCreateUser(params).promise();

  const params2 = {
    UserPoolId: poolId,
    Username: TEST_USER_2,
    TemporaryPassword: 'sWuV9;~y<;',
    MessageAction: 'SUPPRESS',
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'True',
      },
      {
        Name: 'phone_number_verified',
        Value: 'True',
      },
      {
        Name: 'email',
        Value: testUserEmail,
      },
      {
        Name: 'phone_number',
        Value: '+447732432439',
      },
    ],
  };

  console.log(`Seeding ${poolId} with:`, JSON.stringify(params2, null, 2));
  await cognito.adminCreateUser(params2).promise();

  console.log('Password is', testPassword);

  const params4 = {
    Password: testPassword,
    Permanent: true,
    Username: TEST_USER_2,
    UserPoolId: poolId,
  };

  console.log(`Changing password with params:`, params4);
  await cognito.adminSetUserPassword(params4).promise();
};
