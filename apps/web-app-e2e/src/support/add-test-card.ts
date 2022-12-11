import { CHARGEBEE, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';

export const addTestCard = async (id: string) => {
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];

  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });

  const TEST_CARD_VALID_ACCOUNT = '4111111111111111';
  const TEST_CARD_CVV = '100';
  const TEST_CARD_EXPIRY_MONTH = 12;
  const TEST_CARD_EXPIRY_YEAR = 2023;

  console.log('Adding test card');

  await new Promise<{ list: { item_price: { id: string } }[] }>(
    (accept, reject) => {
      chargebee.payment_source
        .create_card({
          customer_id: id,
          card: {
            number: TEST_CARD_VALID_ACCOUNT,
            cvv: TEST_CARD_CVV,
            expiry_year: TEST_CARD_EXPIRY_YEAR,
            expiry_month: TEST_CARD_EXPIRY_MONTH,
          },
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
  return null;
};
