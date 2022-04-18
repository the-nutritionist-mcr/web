import { Heading, Header, Button } from 'grommet';

import React from 'react';
import Finalize from './Finalize';
import generateDeliveryPlanDocumentDefinition from '../../lib/generateDeliveryPlanDocumentDefinition';
import downloadPdf from '../../lib/downloadPdf';
import { defaultDeliveryDays } from '@tnmw/config';
import { Cook, CustomerMealsSelection, Recipe } from '@tnmw/types';

interface PlannerProps {
  cooks: Cook[];
  selections: CustomerMealsSelection;
  recipes: Recipe[];
}

const Planner: React.FC<PlannerProps> = (props) => {
  const customerMeals = props.selections;
  const recipes = props.recipes;

  return (
    <>
      <Header align="center" justify="start" gap="small">
        <Heading level={2}>Planner</Heading>
        <Button
          primary
          size="small"
          label="Pack Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            const plan = generateDeliveryPlanDocumentDefinition(
              customerMeals ?? [],
              recipes
            );
            downloadPdf(plan, 'pack-plan.pdf');
          }}
        />
        <Button
          primary
          size="small"
          label="Cook Plan"
          disabled={Boolean(!customerMeals || !recipes)}
          onClick={() => {
            // Noop
          }}
        />
        {defaultDeliveryDays.map((_, deliveryIndex) => (
          <Button
            key={`delivery-${deliveryIndex}-labels-button`}
            primary
            size="small"
            label={`Labels ${deliveryIndex + 1}`}
            disabled={Boolean(!customerMeals || !recipes)}
            onClick={() => {
              // Noop
            }}
          />
        ))}
        <Button
          primary
          size="small"
          label="Reset"
          onClick={(): void => {
            // Noop
          }}
        />
      </Header>
      <Finalize
        cooks={props.cooks}
        recipes={props.recipes}
        customerMeals={props.selections}
      />
    </>
  );
};

export default Planner;
