import {
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { getPlans } from '../get-plans';

export const handleSubscriptionEvent = async (
  client: ChargeBee,
  customerId: string
) => {
  const poolId = process.env[ENV.varNames.CognitoPoolId];

  const plans = await getPlans(client, customerId);

  const input: AdminUpdateUserAttributesCommandInput = {
    UserPoolId: poolId,
    Username: customerId,
    UserAttributes: [
      {
        Name: `custom:${COGNITO.customAttributes.Plans}`,
        Value: JSON.stringify(plans),
      },
      {
        Name: `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`,
        Value: String(Date.now() / 1000),
      },
    ],
  };

  const command = new AdminUpdateUserAttributesCommand(input);

  const cognito = new CognitoIdentityProviderClient({});

  await cognito.send(command);
};
