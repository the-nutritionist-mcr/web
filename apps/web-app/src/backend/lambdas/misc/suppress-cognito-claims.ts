import './init-dd-trace';
import { COGNITO } from '@tnmw/constants';
import { PreTokenGenerationTriggerHandler } from 'aws-lambda';
import { warmer } from './warmer';

export const handler = warmer<PreTokenGenerationTriggerHandler>(
  async (event) => {
    event.response = {
      claimsOverrideDetails: {
        claimsToSuppress: [
          `custom:${COGNITO.customAttributes.Plans}`,
          `custom:${COGNITO.customAttributes.CustomPlan}`,
          `custom:${COGNITO.customAttributes.City}`,
          `custom:${COGNITO.customAttributes.Country}`,
          `custom:${COGNITO.customAttributes.Postcode}`,
          `custom:${COGNITO.customAttributes.Salutation}`,
          `custom:${COGNITO.customAttributes.ChargebeeId}`,
          `custom:${COGNITO.customAttributes.AddressLine1}`,
          `custom:${COGNITO.customAttributes.AddressLine2}`,
          `custom:${COGNITO.customAttributes.AddressLine3}`,
          `custom:${COGNITO.customAttributes.ProfileNotes}`,
          `custom:${COGNITO.customAttributes.DeliveryDay1}`,
          `custom:${COGNITO.customAttributes.DeliveryDay2}`,
          `custom:${COGNITO.customAttributes.DeliveryDay3}`,
          `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`,
          `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`,
          COGNITO.standardAttributes.phone,
          COGNITO.standardAttributes.emailVerified,
        ],
      },
    };
    return event;
  }
);
