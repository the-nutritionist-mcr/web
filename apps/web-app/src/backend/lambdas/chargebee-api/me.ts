import { ENV } from '../../../infrastructure/constants';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE } from '@tnmw/constants';

const chargebee = new ChargeBee();

chargebee.configure({
  site: process.env[ENV.varNames.ChargeBeeSite],
  api_key: process.env[ENV.varNames.ChargeBeeToken],
});

import { authorise } from '../data-api/authorise';
import { returnErrorResponse } from '../data-api/return-error-response';

const getPlansForCustomer = async (id: string) => {
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

      console.log('plan id', entry.subscription.plan_id);

      const plan = await chargebee.plan
        .retrieve(entry.subscription.plan_id)
        .request();

      console.log('item price id', planSubscriptionItem[0].item_price_id);

      const itemPrice = chargebee.item_price
        .retrieve(planSubscriptionItem[0].item_price_id)
        .request();

      const daysPerWeek = Number(plan[CHARGEBEE.customFields.plan.daysPerWeek]);
      const itemsPerDay = Number(plan[CHARGEBEE.customFields.plan.itemsPerDay]);
      const totalMeals = daysPerWeek * itemsPerDay;
      // eslint-disable-next-line unicorn/no-await-expression-member
      const { name } = (await itemPrice).item_family;
      return {
        name,
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

  const { first_name, last_name, email, billing_address, phone } =
    // eslint-disable-next-line unicorn/no-await-expression-member
    (await customerPromise).customer;
  const {
    line1,
    line2,
    line3,
    city,
    country,
    zip: postcode,
  } = billing_address ?? {};

  return {
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
    const { username } = await authorise(event);
    const customer = await getCustomerByid(username);

    return {
      statusCode: 200,
      body: JSON.stringify(customer),
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
      },
    };
  } catch (error) {
    return returnErrorResponse(error);
  }
};
