import { FC, useState } from 'react';
import { TabBox, Tab } from '../../containers';
import MealList from './meal-list';
import TabButton from './tab-button';
import styled from '@emotion/styled';
import { Meal } from './meal';
import { defaultDeliveryDays } from '@tnmw/config';
import { MealCategory } from './meal-category';
import CombinedBasket from './combined-basket';
import { totalOtherSelected } from './total-other-selected';
import { setSelected } from './set-selected';
import { Button } from '../../atoms';
import { CONTACT_EMAIL } from '@tnmw/constants';
import { InitialSelections } from './initial-selections';
import { SetUICustomizationRequest } from '@aws-sdk/client-cognito-identity-provider';
import { ConfirmSelections } from './confirm-selections';

export interface MealSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
}

const DivContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 2rem;
`;

const ButtonBox = styled.div`
  width: 100%;
  gap: 1rem;
  display: grid;
  margin-top: 3rem;
  grid-template-columns: 4fr 2fr;
  & > * {
    grid-column-start: 2;
    grid-column-end: 2;
  }
`;

const createDefaultSelectedThings = (things: Meal[][]) =>
  things.map((day) => Object.fromEntries(day.map((thing) => [thing.id, 0])));

const MealSelections: FC<MealSelectionsProps> = (props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState(
    props.availableMeals.map((meals) =>
      createDefaultSelectedThings(meals.options)
    )
  );

  const availableMeals = props.availableMeals.flatMap((category) =>
    category.options.flat()
  );

  const hasMeal = (meal: Meal | undefined): meal is Meal => Boolean(meal);

  console.log(selectedMeals);

  const optionsWithSelections = props.availableMeals.map((category, index) => ({
    ...category,
    selections: selectedMeals[index]
      .map((delivery) =>
        Object.entries(delivery).flatMap(([id, count]) =>
          Array.from({ length: count }).map(() =>
            availableMeals.find((meal) => meal.id === id)
          )
        )
      )
      .map((delivery) => delivery.filter(hasMeal)),
  }));

  console.log(optionsWithSelections);

  const tabs = props.availableMeals.length * defaultDeliveryDays.length;

  const [tabIndex, setTabIndex] = useState(0);

  const next = () => {
    if (tabIndex < tabs - 1) {
      setTabIndex((index) => index + 1);
    } else {
      setShowConfirm(true);
    }
  };

  const prev = () => {
    if (tabIndex > 0) {
      setTabIndex((index) => index - 1);
    }
  };

  return props.availableMeals.length === 0 ? (
    <>
      It looks like you've not got any meals available yet. If this is wrong,
      get in touch with us at {CONTACT_EMAIL} to let us know
    </>
  ) : (
    <DivContainer>
      {!showConfirm ? (
        <InitialSelections
          {...props}
          selectedMeals={selectedMeals}
          setSelectedMeals={setSelectedMeals}
          currentTabIndex={tabIndex}
        />
      ) : (
        <ConfirmSelections selectedMeals={optionsWithSelections} />
      )}
      <ButtonBox>
        <Button size="large" primary color="callToAction" onClick={next}>
          Continue
        </Button>
        <Button size="large" onClick={prev}>
          Go Back
        </Button>
      </ButtonBox>
    </DivContainer>
  );
};

export default MealSelections;
