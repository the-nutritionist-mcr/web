import {
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { DYNAMO, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { getPlans } from '../get-plans';

export const handleSubscriptionCreatedEvent = async (
  client: ChargeBee,
  event: ReturnType<typeof client.event.deserialize>
) => {
  const poolId = process.env[ENV.varNames.CognitoPoolId];
  const { id } = event.content.customer;

  const subItems = event.content.subscription.subscription_items.map(
    ({ item_type, item_price_id }) => ({
      item_type,
      item_price_id,
    })
  );

  const plans = await getPlans(client, subItems);

  const input: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: poolId,
    Username: id,
    UserAttributes: [
      {
        Name: `custom:${DYNAMO.customAttributes.Plans}`,
        Value: JSON.stringify(plans),
      },
      {
        Name: `custom:${DYNAMO.customAttributes.SubscriptionUpdateTimestamp}`,
        Value: String(Date.now() / 1000),
      },
    ],
  };

  const command = new AdminUpdateUserAttributesCommand(input);

  const cognito = new CognitoIdentityProviderClient({});

  await cognito.send(command);
};
