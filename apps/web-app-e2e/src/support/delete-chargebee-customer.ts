import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE, ENV } from '@tnmw/constants';

export const deleteChargebeeCustomer = async (id: string) => {
  const chargebee = new ChargeBee();
  const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];
  chargebee.configure({
    site: CHARGEBEE.sites.test,
    api_key: key,
  });

  await new Promise((accept, reject) => {
    chargebee.customer.delete(id).request(function (error, result) {
      if (error) {
        reject(error);
      } else {
        accept(result);
      }
    });
  });

  return null;
};
