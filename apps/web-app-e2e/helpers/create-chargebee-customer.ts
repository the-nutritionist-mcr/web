export const createChargebeeCustomer = async () => {
  chargebee.configure({
    site: CHARGEBEE_SITES.test,
    api_key: process.env[`NX_${ENV.varNames.ChargeBeeToken}`],
  });

  await new Promise((accept, reject) => {
    chargebee.customer
      .create({
        id: TEST_USER,
        first_name: 'John',
        last_name: 'Doe',
        email: E2E.testEmail,
        locale: 'fr-CA',
        billing_address: {
          first_name: 'John',
          last_name: 'Doe',
          line1: 'PO Box 9999',
          city: 'Walnut',
          state: 'California',
          zip: '91789',
          country: 'US',
        },
      })
      .request(function (error, result) {
        if (error) {
          reject(error);
        } else {
          accept(result);
        }
      });
  });

  return null;
};
