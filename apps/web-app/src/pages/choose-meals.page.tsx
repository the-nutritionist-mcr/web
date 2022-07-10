import { getClosingDate } from '../utils/get-closing-date';
import { FC } from 'react';
import { Hero, MealSelections } from '@tnmw/components';
import { useEffect } from 'react';

import {
  authorizedRoute,
  AuthorizedRouteProps,
} from '../utils/authorised-route';

import { usePlan } from '../hooks';
import styled from 'styled-components';

const ChooseMealsHeaderBox = styled('div')`
  text-align: center;
  color: #3b7d7a;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ChooseMealsHeader = styled('h1')`
  font-size: 4rem;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const ChooseMealsPage: FC<AuthorizedRouteProps> = ({ user }) => {
  const { data, submitOrder } = usePlan();

  useEffect(() => {
    const now = new Date(Date.now());

    const go =
      data &&
      (!data.available || now >= getClosingDate(new Date(Number(data.date))));

    if (go) {
      window.location = '/account';
    }
  }, [data]);

  if (!data?.available) {
    return <></>;
  }

  const recipes = data.cooks.flatMap((cook) => cook.menu);

  const meals = user.plans.map((plan) => ({
    title: plan.name,
    isExtra: plan.isExtra,
    maxMeals: plan.totalMeals,
    options: data.cooks.map((cook) =>
      cook.menu.map((recipe) => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
        contains: recipe.allergens,
      }))
    ),
  }));

  return (
    <>
      <Hero>
        <ChooseMealsHeaderBox>
          <ChooseMealsHeader>Meal Selection</ChooseMealsHeader>
        </ChooseMealsHeaderBox>
      </Hero>
      <MealSelections
        currentSelection={data.currentUserSelection}
        submitOrder={submitOrder}
        recipes={recipes}
        availableMeals={meals}
        deliveryDates={data.cooks.map((cook) => cook.date)}
      />
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default ChooseMealsPage;
