import { CHARGEBEE, ENV } from '@tnmw/constants';
import { ChargeBee } from 'chargebee-typescript';

const key = process.env[`NX_${ENV.varNames.ChargeBeeToken}`];

export const chargebee = new ChargeBee();

chargebee.configure({
  site: CHARGEBEE.sites.test,
  api_key: key,
});
