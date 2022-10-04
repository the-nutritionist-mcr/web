import { FC } from 'react';

import { Pricing as PricingComponent } from '@tnmw/static-pages';

const OurStory: FC = () => {
  return process.env['APP_VERSION'] === 'prod' ? <PricingComponent /> : <></>;
};

export default OurStory;
