import { Arn, ArnFormat } from 'aws-cdk-lib';

export const makeArnRegionless = (arn: string, format: ArnFormat) => {
  const arnParts = Arn.split(arn, format);
  return Arn.format({
    ...arnParts,
    region: '*',
  });
};
