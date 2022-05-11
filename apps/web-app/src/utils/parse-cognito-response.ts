import {
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO } from '@tnmw/constants';
import { BackendCustomer } from '@tnmw/types';

const getAttributeValue = (attributes: AttributeType[], key: string) =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

export const parseCognitoResponse = (attributes: AttributeType[]): Omit<BackendCustomer, "username"> => {
  const plansValue = getAttributeValue(
    attributes,
    `custom:${COGNITO.customAttributes.Plans}`
  );
  return {
    salutation: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.Salutation}`
    ),
    country: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.Country}`
    ),
    deliveryDay1: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay1}`
    ),
    deliveryDay2: getAttributeValue(
      attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay2}`
    ),
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
    plans: JSON.parse(plansValue ? plansValue : '[]'),
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
    surname: getAttributeValue(
      attributes,
      COGNITO.standardAttributes.surname
    ),
    email: getAttributeValue(
      attributes,
      COGNITO.standardAttributes.email
    ),
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
