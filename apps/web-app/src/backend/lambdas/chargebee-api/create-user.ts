import { DYNAMO } from '@tnmw/constants';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';
import { transformPhoneNumberToCognitoFormat } from '../transform-phone-number';

export const createUser = async ({
  phone,
  poolId,
  email,
  username,
  last_name,
  first_name,
  address1,
  address2,
  address3,
  delivery1,
  delivery2,
  delivery3,
  city,
  postcode,
  country,
  profileNotes,
}: {
  poolId: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2: string;
  address3: string;
  delivery1: string;
  delivery2: string;
  delivery3: string;
  phone: string;
  city: string;
  postcode: string;
  country: string;
  profileNotes: string;
}) => {};
