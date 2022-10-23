import { CdkCustomResourceEvent } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommandInput,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { mock } from 'jest-mock-extended';
import { handler } from './handler';

import { mockClient } from 'aws-sdk-client-mock';
import {
  USER_POOL_ID_ENV_KEY_STRING,
  SEED_USERS_ENV_KEY_STRING,
} from './constants';
import { SeedUser } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const cognitoMock = mockClient(CognitoIdentityProviderClient);

describe.skip('the webhook handler', () => {
  afterEach(() => {
    cognitoMock.reset();
    delete process.env[USER_POOL_ID_ENV_KEY_STRING];
    delete process.env[SEED_USERS_ENV_KEY_STRING];
  });

  it('changes the password automatically if state is set to "Complete" when resource is updated', async () => {
    const users: SeedUser[] = [
      {
        username: 'foo',
        email: 'foo@bar.com',
        password: 'bar',
        state: 'ForceChangePassword',
      },
      {
        username: 'foo-two',
        email: 'footwo@bar.com',
        password: 'bar-two',
        state: 'Complete',
      },
    ];

    process.env[SEED_USERS_ENV_KEY_STRING] = JSON.stringify(users);
    process.env[USER_POOL_ID_ENV_KEY_STRING] = 'test-pool-id';

    const mockEvent = mock<CdkCustomResourceEvent>();

    mockEvent.RequestType = 'Update';

    await handler(mockEvent, mock(), mock());

    // TODO raise bug report on aws-sdk-client-mock repo for this type error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createCalls = cognitoMock.commandCalls(AdminCreateUserCommand as any);

    expect(createCalls).toHaveLength(2);

    const changePasswordParams = {
      Password: 'bar-two',
      Permanent: true,
      Username: 'foo-two',
      UserPoolId: 'test-pool-id',
    };

    const changePasswordCalls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminSetUserPasswordCommand as any,
      changePasswordParams
    );

    expect(changePasswordCalls).toHaveLength(1);
  });

  it('delete previous users and creates a new user for each seed user when resource is updated', async () => {
    const users: SeedUser[] = [
      {
        username: 'foo',
        email: 'foo@bar.com',
        password: 'bar',
        state: 'ForceChangePassword',
      },
      {
        username: 'foo-two',
        email: 'footwo@bar.com',
        password: 'bar-two',
        state: 'ForceChangePassword',
      },
    ];

    process.env[SEED_USERS_ENV_KEY_STRING] = JSON.stringify(users);
    process.env[USER_POOL_ID_ENV_KEY_STRING] = 'test-pool-id';

    const mockEvent = mock<CdkCustomResourceEvent>();

    mockEvent.RequestType = 'Update';

    await handler(mockEvent, mock(), mock());

    const deleteInput: AdminDeleteUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo',
    };

    const deleteCommandCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminDeleteUserCommand as any,
      deleteInput
    );

    expect(deleteCommandCall).toHaveLength(1);

    const deleteInputTwo: AdminDeleteUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo-two',
    };

    const deleteCommandCall2 = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminDeleteUserCommand as any,
      deleteInputTwo
    );

    expect(deleteCommandCall2).toHaveLength(1);

    const inputOne: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo',
      TemporaryPassword: 'bar',
      MessageAction: 'SUPPRESS',
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: `email`,
          Value: 'foo@bar.com',
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
      ],
    };

    const userOneCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      inputOne
    );

    expect(userOneCall).toHaveLength(1);

    const inputTwo: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo-two',
      TemporaryPassword: 'bar-two',
      MessageAction: 'SUPPRESS',
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: `email`,
          Value: 'footwo@bar.com',
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
      ],
    };

    const userTwoCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      inputTwo
    );

    expect(userTwoCall).toHaveLength(1);
  });

  it('changes the password automatically if state is set to "Complete" when resource is created', async () => {
    const users: SeedUser[] = [
      {
        username: 'foo',
        email: 'foo@bar.com',
        password: 'bar',
        state: 'ForceChangePassword',
      },
      {
        username: 'foo-two',
        email: 'footwo@bar.com',
        password: 'bar-two',
        state: 'Complete',
      },
    ];

    process.env[SEED_USERS_ENV_KEY_STRING] = JSON.stringify(users);
    process.env[USER_POOL_ID_ENV_KEY_STRING] = 'test-pool-id';

    const mockEvent = mock<CdkCustomResourceEvent>();

    mockEvent.RequestType = 'Create';

    await handler(mockEvent, mock(), mock());

    // TODO raise bug report on aws-sdk-client-mock repo for this type error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createCalls = cognitoMock.commandCalls(AdminCreateUserCommand as any);

    expect(createCalls).toHaveLength(2);

    const changePasswordParams = {
      Password: 'bar-two',
      Permanent: true,
      Username: 'foo-two',
      UserPoolId: 'test-pool-id',
    };

    const changePasswordCalls = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminSetUserPasswordCommand as any,
      changePasswordParams
    );

    expect(changePasswordCalls).toHaveLength(1);
  });

  it('creates a new user for each seed user when resource is created', async () => {
    const users: SeedUser[] = [
      {
        username: 'foo',
        email: 'foo@bar.com',
        password: 'bar',
        state: 'ForceChangePassword',
      },
      {
        username: 'foo-two',
        email: 'footwo@bar.com',
        password: 'bar-two',
        state: 'ForceChangePassword',
      },
    ];

    process.env[SEED_USERS_ENV_KEY_STRING] = JSON.stringify(users);
    process.env[USER_POOL_ID_ENV_KEY_STRING] = 'test-pool-id';

    const mockEvent = mock<CdkCustomResourceEvent>();

    mockEvent.RequestType = 'Create';

    await handler(mockEvent, mock(), mock());

    const deleteInput: AdminDeleteUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo',
    };

    const deleteCommandCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminDeleteUserCommand as any,
      deleteInput
    );

    expect(deleteCommandCall).toHaveLength(1);

    const deleteInputTwo: AdminDeleteUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo-two',
    };

    const deleteCommandCall2 = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminDeleteUserCommand as any,
      deleteInputTwo
    );

    expect(deleteCommandCall2).toHaveLength(1);

    const inputOne: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo',
      TemporaryPassword: 'bar',
      MessageAction: 'SUPPRESS',
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: `email`,
          Value: 'foo@bar.com',
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
      ],
    };

    const userOneCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      inputOne
    );

    expect(userOneCall).toHaveLength(1);

    const inputTwo: AdminCreateUserCommandInput = {
      UserPoolId: 'test-pool-id',
      Username: 'foo-two',
      TemporaryPassword: 'bar-two',
      MessageAction: 'SUPPRESS',
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: `email`,
          Value: 'footwo@bar.com',
        },
        {
          Name: 'email_verified',
          Value: 'True',
        },
      ],
    };

    const userTwoCall = cognitoMock.commandCalls(
      // TODO raise bug report on aws-sdk-client-mock repo for this type error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      AdminCreateUserCommand as any,
      inputTwo
    );

    expect(userTwoCall).toHaveLength(1);
  });
});
