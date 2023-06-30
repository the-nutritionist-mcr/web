import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { itemFamilies } from '@tnmw/config';
import { COGNITO } from '@tnmw/constants';
import { BackendCustomer, StandardPlan } from '@tnmw/types';
import { hydrateCustomPlan } from '../backend/lambdas/misc/hydrate-custom-plan';

const getAttributeValue = (attributes: AttributeType[], key: string) =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

export const parseCognitoResponse = (
  attributes: AttributeType[]
): Omit<BackendCustomer, 'username' | 'groups'> => {
  const plansValue = getAttributeValue(
    attributes,
    `custom:${COGNITO.customAttributes.Plans}`
  );
  const customPlansValue = getAttributeValue(
    attributes,
    `custom:${COGNITO.customAttributes.CustomPlan}`
  );
  const customisationsValue = getAttributeValue(
    attributes,
    `custom:${COGNITO.customAttributes.UserCustomisations}`
  );

  const bags = getAttributeValue(
    attributes,
    `custom:${COGNITO.customAttributes.NumberOfBags}`
  );

  return {
    numberOfBags: Number(
      bags === null || typeof bags === 'undefined' || bags === '' ? 1 : bags
    ),
    salutation: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.Salutation}`
    ),
    country: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.Country}`
    ),
    deliveryNotes: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryNotes}`
    ),
    deliveryDay1: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay1}`
    ),
    deliveryDay2: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay2}`
    ),
    customPlan: hydrateCustomPlan(
      customPlansValue && JSON.parse(customPlansValue),
      itemFamilies
    ),

    customisations:
      (customisationsValue && JSON.parse(customisationsValue)) || [],
    deliveryDay3: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay3}`
    ),
    subscriptionUpdateTime: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`
    ),
    firstName: getAttributeValue(
      attributes,
      COGNITO.standardAttributes.firstName
    ),
    city: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.City}`
    ),
    postcode: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.Postcode}`
    ),
    plans: (
      JSON.parse(plansValue ? plansValue : '[]') as StandardPlan[]
    ).filter((plan) => plan.subscriptionStatus !== 'cancelled'),
    customerUpdateTime: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`
    ),
    addressLine1: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.AddressLine1}`
    ),
    addressLine2: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.AddressLine2}`
    ),
    surname: getAttributeValue(attributes, COGNITO.standardAttributes.surname),
    email: getAttributeValue(attributes, COGNITO.standardAttributes.email),
    addressLine3: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.AddressLine3}`
    ),
    phoneNumber: getAttributeValue(
      attributes,
      COGNITO.standardAttributes.phone
    ),
  };
};
