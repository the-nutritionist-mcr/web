import { FC } from 'react';
import { Hero, MealSelections } from '@tnmw/components';
import { useEffect } from 'react';

import {
  authorizedRoute,
  AuthorizedRouteProps,
} from '../utils/authorised-route';

import { usePlan, useRecipes } from '../hooks';
import styled from 'styled-components';
import { getClosedOrOpenStatus } from '../utils/get-closed-or-open-status';
import { RedirectIfLoggedOut } from '../components/authentication/redirect-if-logged-out';
import { useMe } from '../hooks/use-me';

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

const ChooseMealsPage = () => {
  const { data, submitOrder } = usePlan();
  const user = useMe();

  console.log(user);

  const recipes = data?.available
    ? data.plan.cooks.flatMap((cook) => cook.menu)
    : [];

  const alternateRecipeIds = recipes
    .flatMap((recipe) => recipe.alternates ?? [])
    .map((alternate) => alternate.recipeId);

  const { items: alternateRecipes } = useRecipes(alternateRecipeIds);

  useEffect(() => {
    const now = new Date(Date.now());
  }, [data]);

  console.log(data?.available, alternateRecipes);

  if (!data?.available) {
    return <></>;
  }

  const meals = user.plans
    .filter((plan) => plan.totalMeals > 0)
    .map((plan) => ({
      title: plan.name,
      isExtra: plan.isExtra,
      maxMeals: plan.totalMeals,
      options: data.plan.cooks.map((cook) => cook.menu),
    }));

  return (
    <RedirectIfLoggedOut redirectTo="/login">
      <Hero>
        <ChooseMealsHeaderBox>
          <ChooseMealsHeader>Meal Selection</ChooseMealsHeader>
        </ChooseMealsHeaderBox>
      </Hero>
      <MealSelections
        currentSelection={data.currentUserSelection}
        submitOrder={submitOrder}
        recipes={[...recipes, ...(alternateRecipes ?? [])]}
        customer={user}
        availableMeals={meals}
        deliveryDates={data.plan.cooks.map((cook) => cook.date)}
      />
    </RedirectIfLoggedOut>
  );
};

export default ChooseMealsPage;
