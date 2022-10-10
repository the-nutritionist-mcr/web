import { BackendCustomer } from '@tnmw/types';
import { Tag, Box } from 'grommet';
import { noPlan } from './customers.css';

interface CustomisationsCellProps {
  customer: BackendCustomer;
}
export const CustomisationsCell = (props: CustomisationsCellProps) => {
  if (props.customer.plans.length === 0) {
    return <span className={noPlan}>None</span>;
  }

  return (
    <Box direction="row" gap="xsmall">
      {(props.customer.customisations ?? []).map((customisation) => (
        <Tag value={customisation.name} size="xsmall" />
      ))}
    </Box>
  );
};
