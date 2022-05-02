import {
  CustomerWithChargebeePlan,
  CustomerPlan,
  StandardPlan,
  CustomerPlanWithoutConfiguration,
  PlanLabels,
  DaysPerWeek,
  PlanConfiguration,
  Exclusion,
} from '@tnmw/types';

import { COGNITO } from '@tnmw/constants';
import { makeNewPlan } from '@tnmw/meal-planning';

import {
  ListUsersCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { defaultDeliveryDays, extrasLabels, planLabels } from '@tnmw/config';

const convertPlanFormat = (
  plans: StandardPlan[]
): CustomerPlanWithoutConfiguration =>
  plans
    .map((plan) =>
      makeNewPlan(
        {
          defaultDeliveryDays,
          planLabels: [...planLabels],
          extrasLabels: [...extrasLabels],
        },
        {
          planType: plan.name as PlanLabels,
          daysPerWeek: plan.daysPerWeek as DaysPerWeek,
          mealsPerDay: plan.itemsPerDay,
        }
      )
    )
    .reduce<Omit<CustomerPlan, 'configuration'>>(
      (accum, item) => ({
        deliveries: accum.deliveries.map((delivery, index) => ({
          // eslint-disable-next-line security/detect-object-injection
          items: delivery.items.concat(item.deliveries[index].items),
          extras: [],
        })),
        configuration: {} as PlanConfiguration,
      }),
      {
        deliveries: Array.from({ length: defaultDeliveryDays.length }).map(
          () => ({
            items: [],
            extras: [],
          })
        ),
      }
    );

const getJsonAttributeValue = <T>(
  attributes: ListUsersCommandOutput['Users'][number]['Attributes'],
  key: string,
  defaultValue: T
): T => {
  try {
    const rawValue = getAttributeValue(attributes, key);

    return JSON.parse(rawValue);
  } catch {
    return defaultValue;
  }
};

const getAttributeValue = (
  attributes: ListUsersCommandOutput['Users'][number]['Attributes'],
  key: string
): string | undefined =>
  attributes.find((attribute) => attribute.Name === key)?.Value ?? '';

export const parseUserType = (user: UserType) => ({
  exclusions: getJsonAttributeValue<Exclusion[]>(
    user.Attributes,
    `custom:${COGNITO.customAttributes.UserCustomisations}`,
    []
  ),
  chargebeePlan: getJsonAttributeValue(
    user.Attributes,
    `custom:${COGNITO.customAttributes.Plans}`,
    []
  ),
  newPlan: convertPlanFormat(
    getJsonAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.Plans}`,
      []
    )
  ) as CustomerPlanWithoutConfiguration,
  id: user.Username,
  salutation: getAttributeValue(
    user.Attributes,
    `custom:${COGNITO.customAttributes.Salutation}`
  ),
  firstName: getAttributeValue(
    user.Attributes,
    COGNITO.standardAttributes.firstName
  ),
  surname: getAttributeValue(
    user.Attributes,
    COGNITO.standardAttributes.surname
  ),
  address: [
    getAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine1}`
    ),
    getAttributeValue(
      user.Attributes,
      `custom:${COGNITO.customAttributes.AddressLine2}`
    ),
  ].join('\n'),
  email: getAttributeValue(user.Attributes, COGNITO.standardAttributes.email),
  addressLine3: getAttributeValue(
    user.Attributes,
    `custom:${COGNITO.customAttributes.AddressLine3}`
  ),
  telephone: getAttributeValue(
    user.Attributes,
    COGNITO.standardAttributes.phone
  ),
});

export const parseCustomerList = (
  output: ListUsersCommandOutput
): CustomerWithChargebeePlan[] => {
  return output.Users.map((user) => parseUserType(user));
};
