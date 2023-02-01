import React, { FC } from 'react';
import MealDeliveriesTable from './MealDeliveriesTable';
import { PlannerConfig, Exclusion, Delivery } from '@tnmw/types';
import { Box, Button, Header, Heading, Paragraph } from 'grommet';

interface PlanPanelProps {
  plannerConfig: PlannerConfig;
  exclusions: Exclusion[];
  defaultPlan: Delivery[];
  customPlan?: Delivery[];
  deliveryDays: string[];
  onChange?: (newCustomerPlan?: Delivery[]) => void;
  onClear: () => void;
}

const PlanPanel: FC<PlanPanelProps> = (props) => {
  const customerPlan = props.customPlan ?? props.defaultPlan;

  const updatePlan = (deliveryPlan: Delivery[]) => {
    props.onChange?.(deliveryPlan);
  };

  return (
    <Box gap="small">
      <Header gap="small" justify="start">
        <Heading level={3}>Meal Distribution</Heading>
        {props.customPlan && (
          <Button label="Remove Custom Plan" primary onClick={props.onClear} />
        )}
      </Header>
      {props.customPlan && (
        <Paragraph
          fill
          style={{
            border: '1px solid #AB3842',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '10px',
            backgroundColor: '#F8D1D3',
            color: '#AB3842',
          }}
        >
          This is a CUSTOM plan, which means it has been LOCKED to this
          distribution.{' '}
          <strong>
            If you make any changes to the Chargebee subscriptions for this
            customer you will need to make manual updates here also
          </strong>
        </Paragraph>
      )}
      <Box direction="row">
        <MealDeliveriesTable
          deliveries={customerPlan}
          deliveryDays={props.deliveryDays}
          plannerConfig={props.plannerConfig}
          onChange={(deliveryPlan) => updatePlan(deliveryPlan)}
        />
      </Box>
    </Box>
  );
};
export default PlanPanel;
