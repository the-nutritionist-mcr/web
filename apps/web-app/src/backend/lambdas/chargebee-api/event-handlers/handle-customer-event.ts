import {
    AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { CHARGEBEE, DYNAMO, E2E, ENV } from '@tnmw/constants';
import { ChargeBee, _event } from 'chargebee-typescript';
import { transformPhoneNumberToCognitoFormat } from '../../transform-phone-number';

export const handleCustomerEvent = async (
  client: ChargeBee,
  event: ReturnType<typeof client.event.deserialize>
) => {
  const poolId = process.env[ENV.varNames.CognitoPoolId];
  const environment = process.env[ENV.varNames.EnvironmentName];

  const { id, email, first_name, last_name, billing_address, phone } =
    event.content.customer;

  const delivery1 =
    event.content.customer[CHARGEBEE.customFields.customer.deliveryDay1];
  const delivery2 =
    event.content.customer[CHARGEBEE.customFields.customer.deliveryDay2];
  const delivery3 =
    event.content.customer[CHARGEBEE.customFields.customer.deliveryDay3];
  const profileNotes =
    event.content.customer[
      CHARGEBEE.customFields.customer.customerProfileNotes
    ];

  const {
    line1,
    line2,
    line3,
    city,
    country,
    zip: postcode,
  } = billing_address ?? {};

  const hasChargebeeId = event.event_type === "customer_created" ? 
      [{
        Name: `custom:${DYNAMO.customAttributes.ChargebeeId}`,
        Value: id,
      }] : []

  const input: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: poolId,
    Username: id,
    UserAttributes: [
      {
        Name: `custom:${DYNAMO.customAttributes.City}`,
        Value: city ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.Country}`,
        Value: country ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.Postcode}`,
        Value: postcode ?? '',
      },
      {
        Name: DYNAMO.standardAttributes.phone,
        Value: transformPhoneNumberToCognitoFormat(phone ?? ''),
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine1}`,
        Value: line1 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine2}`,
        Value: line2 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.AddressLine3}`,
        Value: line3 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.ProfileNotes}`,
        Value: profileNotes ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay1}`,
        Value: delivery1 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay2}`,
        Value: delivery2 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.DeliveryDay3}`,
        Value: delivery3 ?? '',
      },
      {
        Name: `custom:${DYNAMO.customAttributes.CustomerUpdateTimestamp}`,
        Value: String(Date.now() / 1000),
      },
      ...hasChargebeeId,
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

  const command = event.event_type === "customer_created" ? new AdminCreateUserCommand(input) : new AdminUpdateUserAttributesCommand(input)

  const cognito = new CognitoIdentityProviderClient({});

  await cognito.send(command);

  if (environment !== 'prod' && email.trim().toLowerCase() === E2E.testEmail) {
    const client = new CognitoIdentityProviderClient({});

    const params = {
      Password: E2E.testPassword,
      Permanent: true,
      Username: id,
      UserPoolId: poolId,
    };
    const changeCommand = new AdminSetUserPasswordCommand(params);
    await client.send(changeCommand);
  }
};
