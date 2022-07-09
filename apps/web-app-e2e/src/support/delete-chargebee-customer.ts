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

    do {
      let customer = await getCustomer(id);
      console.log('Waiting for customer be deleted...');
      console.log(customer);
      console.log('After log');
    } while (customer && customer?.deleted === false);
    console.log('Exited loop');

    return null;
  } catch (error) {
    console.log('Failed to delete chargebee user');
    console.log(error);
    return null;
  }
};
