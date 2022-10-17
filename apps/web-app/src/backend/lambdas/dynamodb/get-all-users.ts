import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { BackendCustomer } from '@tnmw/types';
import { parseCustomerList } from '../../../utils/parse-customer-list';

export const getAllUsers = async (
  userPool: string,
  paginationToken?: string
): Promise<(BackendCustomer & { id: string })[]> => {
  const cognito = new CognitoIdentityProviderClient({});

  const input: ListUsersCommandInput = paginationToken
    ? {
        UserPoolId: userPool,
        PaginationToken: paginationToken,
      }
    : { UserPoolId: userPool };

  const response = await cognito.send(new ListUsersCommand(input));

  const users = parseCustomerList(response);

  if (response.PaginationToken) {
    return [
      ...users,
      ...(await getAllUsers(userPool, response.PaginationToken)),
    ];
  }

  return users;
};
