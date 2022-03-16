import React, { FC } from 'react';
import {
  Box,
  FormField,
  Select,
  Heading,
  CheckBoxGroup,
  Header,
  Button,
  Paragraph,
} from 'grommet';
import MealDeliveriesTable from './MealDeliveriesTable';
import { makeNewPlan, isCustomDeliveryPlan } from '@tnmw/meal-planning';
import { PlannerConfig, DaysPerWeek, CustomerPlan } from './types';
import Exclusion from '../../domain/Exclusion';
import { daysOfWeek } from '../../lib/config';

interface PlanPanelProps {
  plannerConfig: PlannerConfig;
  exclusions: Exclusion[];
  plan?: CustomerPlan;
  onChange?: (newCustomerPlan: CustomerPlan) => void;
}

const assertDaysPerWeek: (num: number) => asserts num is DaysPerWeek = (
  num
) => {
  if (num <= 0 || num > 7) {
    throw new Error(`${num} is not a valid DaysPerWeek value`);
  }
};

const PlanPanel: FC<PlanPanelProps> = (props) => {
  const [customerPlan, setCustomerPlan] = React.useState<CustomerPlan>(
    props.plan ?? makeNewPlan(props.plannerConfig)
  );

  const customDeliveryPlan = isCustomDeliveryPlan(
    customerPlan,
    props.plannerConfig
  );

  const updatePlan = (...args: Parameters<typeof makeNewPlan>) => {
    const plan = makeNewPlan(...args);
    props.onChange?.(plan);
    setCustomerPlan(plan);
  };

  return (
    <Box direction="column" gap="small">
      <Header justify="start" gap="small">
        <Heading level={3}>Customer Plan</Heading>
        {customDeliveryPlan ? (
          <Button
            label="Clear Custom Plan"
            onClick={() =>
              updatePlan(props.plannerConfig, customerPlan.configuration)
            }
          />
        ) : null}
      </Header>
      <Box direction="row" gap="large">
        <FormField label="Days per week">
          <Select
            data-testid="daysPerWeek"
            options={['1', '2', '3', '4', '5', '6', '7']}
            value={String(customerPlan.configuration.daysPerWeek)}
            disabled={customDeliveryPlan}
            onChange={(event) => {
              const value: number = Number.parseInt(event.value, 10);
              assertDaysPerWeek(value);
              updatePlan(
                props.plannerConfig,
                { daysPerWeek: value },
                customerPlan
              );
            }}
          />
        </FormField>
        <FormField label="Meals per day">
          <Select
            data-testid="mealsPerDay"
            disabled={customDeliveryPlan}
            options={['1', '2', '3', '4']}
            value={String(customerPlan.configuration.mealsPerDay)}
            onChange={(event) =>
              updatePlan(
                props.plannerConfig,
                { mealsPerDay: Number.parseInt(event.value, 10) },
                customerPlan
              )
            }
          />
        </FormField>
        <FormField label="Total Plans">
          <Select
            data-testid="totalPlans"
            options={['1', '2', '3', '4']}
            value={String(customerPlan.configuration.totalPlans)}
            disabled={customDeliveryPlan}
            onChange={(event) =>
              updatePlan(
                props.plannerConfig,
                { totalPlans: Number.parseInt(event.value, 10) },
                customerPlan
              )
            }
          />
        </FormField>

        <FormField label="Plan Variant">
          <Select
            data-testid="planVariant"
            options={props.plannerConfig.planLabels}
            value={String(customerPlan.configuration.planType)}
            disabled={customDeliveryPlan}
            onChange={(event) =>
              updatePlan(
                props.plannerConfig,
                { planType: event.value },
                customerPlan
              )
            }
          />
        </FormField>
      </Box>

      <Box direction="row" gap="large">
        {props.plannerConfig.defaultDeliveryDays.map((defaultDay, index) => (
          <FormField
            key={`delivery-${defaultDay}-${index}`}
            label={`Delivery ${index + 1}`}
          >
            <Select
              data-testid={`delivery-${index}-select`}
              options={daysOfWeek}
              value={customerPlan.configuration.deliveryDays[index]}
              onChange={(event) => {
                const newDeliveryDays = [
                  ...customerPlan.configuration.deliveryDays,
                ];
                newDeliveryDays[index] = event.value;
                updatePlan(
                  props.plannerConfig,
                  { deliveryDays: newDeliveryDays },
                  customerPlan
                );
              }}
            />
          </FormField>
        ))}

        <FormField name="exclusions" label="Customisations">
          <Select
            multiple
            closeOnChange={false}
            name="exclusions"
            options={props.exclusions}
            labelKey="name"
            valueKey="name"
          />
        </FormField>
      </Box>
      <Box direction="row" gap="large">
        <CheckBoxGroup
          pad="medium"
          disabled={customDeliveryPlan}
          options={[...props.plannerConfig.extrasLabels]}
          value={[...customerPlan.configuration.extrasChosen]}
          // eslint-disable-next-line no-console
          onChange={(event) =>
            updatePlan(
              props.plannerConfig,
              {
                extrasChosen: (event?.value ??
                  []) as typeof props.plannerConfig.extrasLabels[number][],
              },
              customerPlan
            )
          }
        />
      </Box>

      {customDeliveryPlan && (
        <Box direction="row" align="center">
          <Paragraph color="red" data-testid="summary" fill>
            This customer is on a <strong>custom plan</strong>. Click the above
            button to reset the plan to the default distribution.{' '}
          </Paragraph>
        </Box>
      )}
      <Heading level={3}>Meal Deliveries</Heading>
      <Box direction="row">
        <MealDeliveriesTable
          deliveries={customerPlan.deliveries}
          deliveryDays={customerPlan.configuration.deliveryDays}
          plannerConfig={props.plannerConfig}
          onChange={(deliveryPlan) =>
            updatePlan(props.plannerConfig, {}, customerPlan, deliveryPlan)
          }
        />
      </Box>
    </Box>
  );
};
export default PlanPanel;
