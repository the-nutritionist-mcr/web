import { CHARGEBEE } from '@tnmw/constants';
import { v4 } from 'uuid';

export const addSubscription = async () => {
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];

  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });

  await new Promise<{ list: { item_price: { id: string } }[] }>(
    (accept, reject) => {
      chargebee
        .subscription_pause(planId)
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
};
