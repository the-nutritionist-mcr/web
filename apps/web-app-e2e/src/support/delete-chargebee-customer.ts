import { ChargeBee } from 'chargebee-typescript';
import { CHARGEBEE, ENV } from '@tnmw/constants';

const chargebee = new ChargeBee();

const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];

chargebee.configure({
  site: CHARGEBEE.sites.test,
  api_key: key,
});

const getCustomer = async (id: string) => {
  const result = await new Promise((accept, reject) => {
    chargebee.customer.retrieve(id).request(function (error, result) {
      console.log(error);
      if (error) {
        reject(error);
      } else {
        accept(result);
      }
    });
  });
  return result?.customer;
};

export const deleteChargebeeCustomer = async (id: string) => {
  try {
    console.log(`Deleting chargebee user '${id}'`);

    await new Promise((accept, reject) => {
      chargebee.customer.delete(id).request(function (error, result) {
        if (error) {
          reject(error);
        } else {
          accept(result);
        }
      });
    });

    // eslint-disable-next-line fp/no-let, @typescript-eslint/no-explicit-any
    let customer: any;
    // eslint-disable-next-line fp/no-loops
    do {
      customer = await getCustomer(id);
    } while (customer && customer?.deleted === false);

    return null;
  } catch (error) {
    console.log('Failed to delete chargebee user');
    console.log(error);
    return null;
  }
};
