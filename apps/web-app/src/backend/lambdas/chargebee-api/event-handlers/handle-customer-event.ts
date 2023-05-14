import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { CHARGEBEE, COGNITO, E2E, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { transformPhoneNumberToCognitoFormat } from '../../transform-phone-number';
import { handleSubscriptionEvent } from './handle-subscription-event';
import { userExists } from '../user-exists';
import { getEnv } from '../get-env';

export const handleCustomerEvent = async (
  client: ChargeBee,
  event: ReturnType<typeof client.event.deserialize>
) => {
  const poolId = getEnv(ENV.varNames.CognitoPoolId);
  const environment = process.env[ENV.varNames.EnvironmentName];

  const { id, email, first_name, last_name, billing_address, phone } =
    event.content.customer;

  const customer = event.content.customer as unknown as {
    [key: string]: string | undefined;
  };

  const numberOfBags = customer[CHARGEBEE.customFields.customer.numberOfBags];
  const delivery1 = customer[CHARGEBEE.customFields.customer.deliveryDay1];
  const delivery2 = customer[CHARGEBEE.customFields.customer.deliveryDay2];
  const delivery3 = customer[CHARGEBEE.customFields.customer.deliveryDay3];
  const profileNotes =
    customer[CHARGEBEE.customFields.customer.customerProfileNotes];

  const deliveryNotes = customer[CHARGEBEE.customFields.customer.deliveryNotes];

  const {
    line1,
    line2,
    line3,
    city,
    country,
    zip: postcode,
  } = billing_address ?? {};

  const hasChargebeeId =
    event.event_type === 'customer_created'
      ? [
          {
            Name: `custom:${COGNITO.customAttributes.ChargebeeId}`,
            Value: id,
          },
        ]
      : [];

  const input: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: poolId,
    Username: id,
    UserAttributes: [
      {
        Name: `custom:${COGNITO.customAttributes.City}`,
        Value: city ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.Country}`,
        Value: country ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.Postcode}`,
        Value: postcode ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.NumberOfBags}`,
        Value: String(numberOfBags ?? '1'),
      },
      {
        Name: COGNITO.standardAttributes.phone,
        Value: transformPhoneNumberToCognitoFormat(phone ?? ''),
      },
      {
        Name: `custom:${COGNITO.customAttributes.AddressLine1}`,
        Value: line1 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.AddressLine2}`,
        Value: line2 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.AddressLine3}`,
        Value: line3 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.ProfileNotes}`,
        Value: profileNotes ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.DeliveryDay1}`,
        Value: delivery1 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.DeliveryDay2}`,
        Value: delivery2 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.DeliveryDay3}`,
        Value: delivery3 ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.DeliveryNotes}`,
        Value: deliveryNotes ?? '',
      },
      {
        Name: `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`,
        Value: String(Date.now() / 1000),
      },
      ...hasChargebeeId,
      {
        Name: COGNITO.standardAttributes.email,
        Value: email,
      },
      {
        Name: COGNITO.standardAttributes.emailVerified,
        Value: `true`,
      },
      {
        Name: COGNITO.standardAttributes.firstName,
        Value: first_name,
      },
      {
        Name: COGNITO.standardAttributes.surname,
        Value: last_name,
      },
    ],
  };

  const cognito = new CognitoIdentityProviderClient({});

  if (
    event.event_type === 'customer_changed' &&
    !(await userExists(id, poolId))
  ) {
    console.log('changed and doesn"t exist');
    await cognito.send(
      new AdminCreateUserCommand({
        ...input,
        DesiredDeliveryMediums: ['EMAIL'],
        MessageAction: 'SUPPRESS',
      })
    );

    await handleSubscriptionEvent(client, id);
  } else {
    console.log('else');
    await (event.event_type === 'customer_created'
      ? cognito.send(
          new AdminCreateUserCommand({
            ...input,
            DesiredDeliveryMediums: ['EMAIL'],
            MessageAction: 'SUPPRESS',
          })
        )
      : cognito.send(new AdminUpdateUserAttributesCommand(input)));
  }

  if (
    environment !== 'prod' &&
    email?.trim()?.toLowerCase() === E2E.testCustomer.email
  ) {
    const client = new CognitoIdentityProviderClient({});

    const params = {
      Password: E2E.testCustomer.password,
      Permanent: true,
      Username: id,
      UserPoolId: poolId,
    };
    const changeCommand = new AdminSetUserPasswordCommand(params);
    await client.send(changeCommand);
  }
};
