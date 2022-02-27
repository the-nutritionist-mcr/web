import {
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { DYNAMO, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { getPlans } from '../get-plans';

export const handleSubscriptionEvent = async (
  client: ChargeBee,
  event: ReturnType<typeof client.event.deserialize>
) => {
  const poolId = process.env[ENV.varNames.CognitoPoolId];
  const { id } = event.content.customer;

  const subscription = event.content.subscription

  const plans = await getPlans(client, subscription);

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
