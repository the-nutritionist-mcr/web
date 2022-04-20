import { FC } from 'react';
import { Hero, MealSelections } from '@tnmw/components';

import {
  authorizedRoute,
  AuthorizedRouteProps,
} from '../utils/authorised-route';

import { usePlan } from '../hooks';
import styled from 'styled-components';
import { GetPlanResponse, NotYetPublishedResponse } from '@tnmw/types';

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
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const getMeals = (
  usePlanResponse: GetPlanResponse | NotYetPublishedResponse
) => {
  if (usePlanResponse.available === false) {
    return undefined;
  }
};

const ChooseMealsPage: FC<AuthorizedRouteProps> = ({ user }) => {
  const { data } = usePlan();

  if (!data?.available) {
    return <></>;
  }

  const meals = user.plans.map((plan) => ({
    title: plan.name,
    maxMeals: plan.totalMeals,
    options: data.cooks.map((cook) =>
      cook.menu.map((recipe) => ({
        id: recipe.id,
        title: recipe.name,
        description: recipe.description,
      }))
    ),
  }));

  console.log(meals);
  return (
    <>
      <Hero>
        <ChooseMealsHeaderBox>
          <ChooseMealsHeader>Choose Meals</ChooseMealsHeader>
        </ChooseMealsHeaderBox>
      </Hero>
      <MealSelections
        availableMeals={meals}
        deliveryDates={data.cooks.map((cook) => cook.date)}
      />
    </>
  );
};

export const getServerSideProps = authorizedRoute();

export default ChooseMealsPage;
