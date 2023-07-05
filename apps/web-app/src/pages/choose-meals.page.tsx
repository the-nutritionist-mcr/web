import { Hero, MealSelections } from '@tnmw/components';
import { useEffect } from 'react';

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
  const { data, update } = usePlan();
  const user = useMe();

  const initialRecipes = data?.available
    ? data.plan.cooks.flatMap((cook) => cook.menu)
    : [];

  const recipeIds = initialRecipes.map((recipe) => recipe.id);
  const { items: recipes } = useRecipes(recipeIds);

  // eslint-disable-next-line fp/no-mutating-methods
  const alternateRecipeIds = (recipes ?? [])
    .flatMap((recipe) => recipe.alternates ?? [])
    .map((alternate) => alternate.recipeId)
    .slice()
    .sort((a, b) => (a > b ? 1 : -1));

  const { items: alternateRecipes } = useRecipes(alternateRecipeIds);

  useEffect(() => {
    const now = new Date(Date.now());

    if (data?.available && user) {
      const go = getClosedOrOpenStatus(now, data, user);

      if (!go) {
        window.location.href = '/account';
      }
    }
  }, [data, user]);

  if (!user) {
    return <></>;
  }

  if (!data?.available || !data.currentUserSelection) {
    return <></>;
  }

  return (
    <RedirectIfLoggedOut redirectTo="/login">
      <Hero>
        <ChooseMealsHeaderBox>
          <ChooseMealsHeader>Choose Meals</ChooseMealsHeader>
        </ChooseMealsHeaderBox>
      </Hero>
      <MealSelections
        plan={data.plan}
        currentSelection={data.currentUserSelection}
        cooks={data.plan.cooks}
        submitOrder={update}
        recipes={[...(recipes ?? []), ...(alternateRecipes ?? [])]}
        customer={user}
      />
    </RedirectIfLoggedOut>
  );
};

export default ChooseMealsPage;
