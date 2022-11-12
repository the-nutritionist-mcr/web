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

  const result = await new Promise<{ list: { item_price: { id: string } }[] }>(
    (accept, reject) => {
      chargebee.item_price
        .list({
          item_id: { is: planId },
        })
        .request((error, result) => {
          if (error) {
            reject(error);
          } else {
            accept(result);
          }
        });
    }
  );

  const entry = result.list[0];
  const itemPrice = entry.item_price;

  await new Promise((accept, reject) => {
    chargebee.subscription
      .create_with_items(customerId, {
        subscription_items: [
          {
            item_price_id: itemPrice.id,
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
  return null;
};
