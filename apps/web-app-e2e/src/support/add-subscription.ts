import { CHARGEBEE, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';
import { v4 } from 'uuid';

export const addSubscription = async (
  customerId: string,
  planId: string,
  price: number
) => {
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];

  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });
  const itemPriceId = v4();

  console.log(`Creating item price id ${itemPriceId}`);

  await new Promise((accept, reject) => {
    chargebee.item_price
      .create({
        id: itemPriceId,
        name: 'Price ID',
        item_id: planId,
        currency_code: 'GBP',
        period: 2,
        period_unit: 'year',
        price,
      })
      .request((error, result) => {
        if (error) {
          reject(error);
        } else {
          accept(result);
        }
      });
  });

  console.log(`Creating subscription for customer ${customerId}`);
  await new Promise((accept, reject) => {
    chargebee.subscription
      .create_with_items(customerId, {
        subscription_items: [
          {
            item_price_id: itemPriceId,
            quantity: 1,
          },
        ],
      })
      .request((error, result) => {
        if (error) {
          reject(error);
        } else {
          accept(result);
        }
      });
  });
};
