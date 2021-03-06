import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';
import { ENV, CHARGEBEE, HTTP } from '@tnmw/constants';

import { authoriseJwt } from '../data-api/authorise';
import { returnErrorResponse } from '../data-api/return-error-response';
import { getSecrets } from '../get-secrets';
import { getEnv } from './get-env';

const getPlansForCustomer = async (id: string) => {
  const [chargebeeToken] = getSecrets(getEnv(ENV.varNames.ChargeBeeToken));

  const chargebee = new ChargeBee();

  chargebee.configure({
    site: process.env[ENV.varNames.ChargeBeeSite],
    api_key: await chargebeeToken,
  });

  const { list } = await chargebee.subscription
    .list({ customer_id: { is: id } })
    .request();

  const plans = await Promise.all(
    list.map(async (entry) => {
      const planSubscriptionItem = entry.subscription.subscription_items.filter(
        (item) => item.item_type === CHARGEBEE.itemTypes.plan
      );

      if (planSubscriptionItem.length !== 1) {
        return;
      }

      const itemPriceResult = await chargebee.item_price
        .retrieve(planSubscriptionItem[0].item_price_id)
        .request();

      const itemPrice = itemPriceResult.item_price;

      const itemResult = await chargebee.item
        .retrieve(itemPrice.item_id)
        .request();

      const plan = itemResult.item;

      const daysPerWeek = Number(plan[CHARGEBEE.customFields.plan.daysPerWeek]);
      const itemsPerDay = Number(plan[CHARGEBEE.customFields.plan.itemsPerDay]);

      const itemFamilyResult = await chargebee.item_family
        .retrieve(itemPrice.item_family_id)
        .request();

      const itemFamily = itemFamilyResult.item_family;

      const totalMeals = daysPerWeek * itemsPerDay;
      // eslint-disable-next-line unicorn/no-await-expression-member
      return {
        name: itemFamily.name,
        daysPerWeek,
        itemsPerDay,
        totalMeals,
      };
    })
  );

  return plans.filter(Boolean);
};

const getCustomerByid = async (id: string) => {
  const customerPromise = chargebee.customer.retrieve(id).request();
  const plans = await getPlansForCustomer(id);

  // eslint-disable-next-line unicorn/no-await-expression-member
  const customer = (await customerPromise).customer;

  const profileNotes =
    customer[CHARGEBEE.customFields.customer.customerProfileNotes];
  const deliveryDay1 = customer[CHARGEBEE.customFields.customer.deliveryDay1];
  const deliveryDay2 = customer[CHARGEBEE.customFields.customer.deliveryDay2];
  const deliveryDay3 = customer[CHARGEBEE.customFields.customer.deliveryDay3];

  const { first_name, last_name, email, billing_address, phone } = customer;

  const {
    line1,
    line2,
    line3,
    city,
    country,
    zip: postcode,
  } = billing_address ?? {};

  return {
    deliveryDay1,
    deliveryDay2,
    deliveryDay3,
    profileNotes,
    plans,
    phone,
    first_name,
    last_name,
    email,
    address_line1: line1,
    address_line2: line2,
    address_line3: line3,
    city,
    country,
    postcode,
  };
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { username } = await authoriseJwt(event);
    const customer = await getCustomerByid(username);

    return {
      statusCode: HTTP.statusCodes.Ok,
      body: JSON.stringify(customer),
      headers: {
        [HTTP.headerNames.AccessControlAllowOrigin]: '*',
        [HTTP.headerNames.AccessControlAllowHeaders]: '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
