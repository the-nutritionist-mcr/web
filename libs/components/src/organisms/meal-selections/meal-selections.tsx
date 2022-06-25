import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { Meal } from './meal';
import { defaultDeliveryDays } from '@tnmw/config';
import { MealCategory } from './meal-category';
import { Button } from '../../atoms';
import { CONTACT_EMAIL } from '@tnmw/constants';
import { InitialSelections } from './initial-selections';
import { ConfirmSelections } from './confirm-selections';
import { remainingMeals } from './count-meals';

export interface MealSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
}

const DivContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  max-width: 1460px;
  gap: 2rem;
  padding: 1rem;
`;

const ButtonBox = styled.div`
  width: 100%;
  gap: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 3rem;
  grid-template-columns: 5rem;
  & > button {
    padding: 1.5rem 0;
    border-radius: 50px;
    width: 20rem;
  }
`;

const hasMeal = (meal: Meal | undefined): meal is Meal => Boolean(meal);

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
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .map((delivery) => delivery.filter(hasMeal)),
  }));

  const remaining = remainingMeals(optionsWithSelections);

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
    if (showConfirm) {
      setShowConfirm(false);
    } else if (tabIndex > 0) {
      setTabIndex((index) => index - 1);
    }
  };

  const continueButtonDisabled = tabIndex === tabs - 1 && remaining !== 0;

  const continueText = continueButtonDisabled
    ? 'Select more meals'
    : 'Continue';

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
          remainingMeals={remaining}
          selectedMeals={selectedMeals}
          setSelectedMeals={setSelectedMeals}
          currentTabIndex={tabIndex}
          onChangeIndex={(index) => {
            setTabIndex(index);
          }}
        />
      ) : (
        <ConfirmSelections selectedMeals={optionsWithSelections} />
      )}
      <ButtonBox>
        <Button
          size="large"
          primary
          color="callToAction"
          onClick={next}
          disabled={continueButtonDisabled}
        >
          {showConfirm ? 'Submit' : continueText}
        </Button>
        <Button size="large" onClick={prev}>
          Go Back
        </Button>
      </ButtonBox>
    </DivContainer>
  );
};

export default MealSelections;
