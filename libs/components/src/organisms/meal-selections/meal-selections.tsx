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
import {
  Recipe,
  StoredMealSelection,
  SubmitCustomerOrderPayload,
} from '@tnmw/types';
import { isSelectedMeal } from '@tnmw/meal-planning';

export interface MealSelectionsProps {
  availableMeals: MealCategory[];
  deliveryDates: string[];
  currentSelection: StoredMealSelection;
  submitOrder: (payload: SubmitCustomerOrderPayload) => Promise<void>;
  recipes: Recipe[];
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

const hasThing = <T,>(thing: T | undefined): thing is T => Boolean(thing);

const createDefaultSelectedThings = (
  categories: MealCategory[],
  selection: StoredMealSelection
) =>
  categories.map((category) =>
    defaultDeliveryDays.map((day, index) => {
      const delivery = selection.selection.deliveries[index];
      return Array.isArray(delivery)
        ? delivery
            .filter((item) => item.chosenVariant === category.title)
            .reduce<{ [id: string]: number }>((accum, item) => {
              const id = isSelectedMeal(item) ? item.recipe.id : 'extra';
              if (isSelectedMeal(item) && id in accum) {
                accum[id]++;
              }

              if (isSelectedMeal(item) && !(id in accum)) {
                accum[item.recipe.id] = 1;
              }
              return accum;
            }, {})
        : undefined;
    })
  );

const MealSelections: FC<MealSelectionsProps> = (props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState(
    createDefaultSelectedThings(props.availableMeals, props.currentSelection)
  );

  const availableMeals = props.availableMeals.flatMap((category) =>
    category.options.flat()
  );

  const optionsWithSelections = props.availableMeals.map((category, index) => ({
    ...category,
    selections: selectedMeals[index]
      .map((delivery) =>
        delivery
          ? Object.entries(delivery).flatMap(([id, count]) =>
              Array.from({ length: count }).map(() =>
                availableMeals.find((meal) => meal.id === id)
              )
            )
          : []
      )
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .map((delivery) => delivery.filter(hasThing)),
  }));

  const remaining = remainingMeals(
    optionsWithSelections.filter((category) => !category.isExtra)
  );

  const tabs =
    props.availableMeals.filter((category) => !category.isExtra).length *
    defaultDeliveryDays.length;

  const [tabIndex, setTabIndex] = useState(0);

  const next = () => {
    if (tabIndex < tabs - 1) {
      setTabIndex((index) => index + 1);
    } else if (!showConfirm) {
      setShowConfirm(true);
    } else {
      const submitOrder: SubmitCustomerOrderPayload = {
        plan: props.currentSelection.id,
        sort: props.currentSelection.sort,
        deliveries: defaultDeliveryDays.map((day, index) => {
          return optionsWithSelections.flatMap((category) =>
            category.selections[index]
              .map((recipe) => {
                const foundRecipe = props.recipes.find(
                  (straw) => recipe.id === straw.id
                );
                if (foundRecipe) {
                  return {
                    recipe: foundRecipe,
                    chosenVariant: category.title,
                  };
                }
                return undefined;
              })
              // eslint-disable-next-line unicorn/no-array-callback-reference
              .filter(hasThing)
          );
        }),
      };
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
