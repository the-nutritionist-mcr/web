import {
  AttributeType,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { COGNITO } from '@tnmw/constants';
import { BackendCustomer } from '@tnmw/types';

const getAttributeValue = (attributes: AttributeType[], key: string) =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

export const parseCognitoResponse = (output: UserType): BackendCustomer => {
  const plansValue = getAttributeValue(
    output.Attributes,
    `custom:${COGNITO.customAttributes.Plans}`
  );
  return {
    username: output.Username,
    salutation: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.Salutation}`
    ),
    country: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.Country}`
    ),
    deliveryDay1: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay1}`
    ),
    deliveryDay2: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay2}`
    ),
    deliveryDay3: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.DeliveryDay3}`
    ),
    subscriptionUpdateTime: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.SubscriptionUpdateTimestamp}`
    ),
    firstName: getAttributeValue(
      output.Attributes,
      COGNITO.standardAttributes.firstName
    ),
    city: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.City}`
    ),
    postcode: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.Postcode}`
    ),
    plans: JSON.parse(plansValue ? plansValue : '[]'),
    customerUpdateTime: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.CustomerUpdateTimestamp}`
    ),
    addressLine1: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine1}`
    ),
    addressLine2: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine2}`
    ),
    surname: getAttributeValue(
      output.Attributes,
      COGNITO.standardAttributes.surname
    ),
    email: getAttributeValue(
      output.Attributes,
      COGNITO.standardAttributes.email
    ),
    addressLine3: getAttributeValue(
      output.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine3}`
    ),
    phoneNumber: getAttributeValue(
      output.Attributes,
      COGNITO.standardAttributes.phone
    ),
  };
};
