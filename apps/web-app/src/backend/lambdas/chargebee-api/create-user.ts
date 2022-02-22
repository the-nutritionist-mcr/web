import { DYNAMO } from '@tnmw/constants';

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

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
}) => {
  const input: AdminCreateUserCommandInput = {
    UserPoolId: poolId,
    Username: username,
    UserAttributes: [
      {
        Name: `custom:${DYNAMO.customAttributes.City}`,
        Value: city,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.Country}`,
        Value: country,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.Postcode}`,
        Value: postcode,
      },
      {
        Name: DYNAMO.standardAttributes.phone,
        Value: phone,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine1}`,
        Value: address1,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine2}`,
        Value: address2,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine3}`,
        Value: address3,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.ProfileNotes}`,
        Value: profileNotes,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay1}`,
        Value: delivery1,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay2}`,
        Value: delivery2,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay3}`,
        Value: delivery3,
      },
      {
        Name: `custom:${DYNAMO.customAttributes.CustomerUpdateTimestamp}`,
        Value: String(Date.now() / 1000),
      },
      {
        Name: `custom:${DYNAMO.customAttributes.ChargebeeId}`,
        Value: username,
      },
      {
        Name: DYNAMO.standardAttributes.email,
        Value: email,
      },
      {
        Name: DYNAMO.standardAttributes.emailVerified,
        Value: `true`,
      },
      {
        Name: DYNAMO.standardAttributes.firstName,
        Value: first_name,
      },
      {
        Name: DYNAMO.standardAttributes.surname,
        Value: last_name,
      },
    ],
  };

  const command = new AdminCreateUserCommand(input);

  const client = new CognitoIdentityProviderClient({});

  await client.send(command);
};
