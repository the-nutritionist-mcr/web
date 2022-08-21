import { useState, useEffect } from 'react';
import { QuantityStepper } from '../../molecules';
import styled from '@emotion/styled';
import { getRealRecipe } from '@tnmw/meal-planning';
import {
  ActivePlanWithMeals,
  BackendCustomer,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import { countsFromPlans } from './count-from-plans';
import { planFromCounts } from './plan-from-counts';

interface BasketProps {
  things: Recipe[];
  title: string;
  plan: StandardPlan;
  itemWord: string;
  itemWordPlural: string;
  selected: ActivePlanWithMeals;
  setSelected: (things: ActivePlanWithMeals) => void;
  customer: BackendCustomer;
  max: number;
}

const toTitleCase = (string: string) => {
  return string.replace(/\w\S*/g, (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  });
};

const BasketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const BasketHeader = styled.h3`
  font-family: 'Acumin Pro', Arial, sans-serif;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1rem 0 0 0;
  padding: 0;
`;

const Basket = (props: BasketProps) => {
  const counts = countsFromPlans(props.selected);

  const totalSelected = props.selected.meals.length;

  if (totalSelected === 0) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const max = props.max - props.selected.meals.length;

  const remaining = props.max - totalSelected;

  const BasketRemaining = styled.p`
    font-family: 'Acumin Pro', Arial, sans-serif;
    color: ${remaining === 0 ? `red` : `default`};
  `;

  const itemWord = totalSelected > 1 ? props.itemWordPlural : props.itemWord;
  return (
    <BasketContainer>
      <BasketHeader>{toTitleCase(props.title)}</BasketHeader>
      <BasketRemaining>
        {remaining} {itemWord} remaining
      </BasketRemaining>
      {props.things.map((thing) => {
        const realRecipe = getRealRecipe(thing, props.customer, props.things);

        if (!counts[thing.id]) {
          return null;
        }

        return (
          <QuantityStepper
            key={`${thing.id}-basket-item`}
            label={realRecipe.name}
            value={counts[thing.id]}
            min={0}
            max={max + counts[thing.id]}
            onChange={(value) => {
              const newCounts = { ...counts, [thing.id]: value };
              props.setSelected({
                ...props.selected,
                meals: planFromCounts(newCounts, props.things, props.plan.name),
              });
            }}
          />
        );
      })}
    </BasketContainer>
  );
};

export default Basket;
