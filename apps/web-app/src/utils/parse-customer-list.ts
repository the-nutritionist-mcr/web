import { BackendCustomer } from '@tnmw/types';

import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { parseCognitoResponse } from './parse-cognito-response';

// const getJsonAttributeValue = <T>(
//   attributes: AttributeType[],
//   key: string,
//   defaultValue: T
// ): T => {
//   try {
//     const rawValue = getAttributeValue(attributes, key);

//     return JSON.parse(rawValue);
//   } catch {
//     return defaultValue;
//   }
// };

// const getAttributeValue = (
//   attributes: AttributeType[],
//   key: string
// ): string | undefined =>
//   attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

// export const parseAttributes = (attributes: AttributeType[]) => ({
//   exclusions: getJsonAttributeValue<Exclusion[]>(
//     attributes,
//     `custom:${COGNITO.customAttributes.UserCustomisations}`,
//     []
//   ),
//   chargebeePlan: getJsonAttributeValue<StandardPlan[]>(
//     attributes,
//     `custom:${COGNITO.customAttributes.Plans}`,
//     []
//   ),
//   country: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.Country}`
//   ),
//   deliveryDay1: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.DeliveryDay1}`
//   ),
//   deliveryDay2: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.DeliveryDay2}`
//   ),
//   deliveryDay3: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.DeliveryDay3}`
//   ),
//   subscriptionUpdateTime: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`
//   ),
//   newPlan: convertPlanFormat(
//     getJsonAttributeValue(
//       attributes,
//       `custom:${COGNITO.customAttributes.Plans}`,
//       []
//     )
//   ) as CustomerPlanWithoutConfiguration,
//   salutation: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.Salutation}`
//   ),
//   firstName: getAttributeValue(
//     attributes,
//     COGNITO.standardAttributes.firstName
//   ),
//   surname: getAttributeValue(attributes, COGNITO.standardAttributes.surname),
//   address: [
//     getAttributeValue(
//       attributes,
//       `custom:${COGNITO.customAttributes.AddressLine1}`
//     ),
//     getAttributeValue(
//       attributes,
//       `custom:${COGNITO.customAttributes.AddressLine2}`
//     ),
//   ].join('\n'),
//   email: getAttributeValue(attributes, COGNITO.standardAttributes.email),
//   addressLine3: getAttributeValue(
//     attributes,
//     `custom:${COGNITO.customAttributes.AddressLine3}`
//   ),
//   telephone: getAttributeValue(attributes, COGNITO.standardAttributes.phone),
// });

export const parseCustomerList = (
  output: ListUsersCommandOutput
): (BackendCustomer & { id: string })[] => {
  return (
    output.Users?.map((user) => {
      return {
        id: user.Username ?? '',
        username: user.Username ?? '',
        groups: [],
        ...parseCognitoResponse(user.Attributes ?? []),
      };
    }) ?? []
  );
};
