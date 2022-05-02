import React, { FC } from 'react';
import MealDeliveriesTable from './MealDeliveriesTable';
import { PlannerConfig, Exclusion, Delivery } from '@tnmw/types';
import { defaultDeliveryDays } from '@tnmw/config';
import { Box, Heading } from 'grommet';

interface PlanPanelProps {
  plannerConfig: PlannerConfig;
  exclusions: Exclusion[];
  customPlan?: Delivery[];
  deliveryDays: string[];
  onChange?: (newCustomerPlan?: Delivery[]) => void;
}

const PlanPanel: FC<PlanPanelProps> = (props) => {
  const [customerPlan, setCustomerPlan] = React.useState(
    props.customPlan ??
      defaultDeliveryDays.map(() => ({ items: [], extras: [] }))
  );

  const updatePlan = (deliveryPlan: Delivery[]) => {
    props.onChange?.(deliveryPlan);
    setCustomerPlan(deliveryPlan);
  };

  return (
    <Box gap="small">
      <Heading level={3}>Custom Plan</Heading>
      <Box direction="row">
        {props.customPlan && (
          <MealDeliveriesTable
            deliveries={customerPlan}
            deliveryDays={props.deliveryDays}
            plannerConfig={props.plannerConfig}
            onChange={(deliveryPlan) => updatePlan(deliveryPlan)}
          />
        )}
      </Box>
    </Box>
  );
};
export default PlanPanel;
