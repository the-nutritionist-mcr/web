import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { MealCategory } from './meal-category';
import { Button } from '../../atoms';
import { CONTACT_EMAIL } from '@tnmw/constants';
import { ParagraphText } from '@tnmw/components';
import { InitialSelections } from './initial-selections';
import { ConfirmSelections } from './confirm-selections';
import { remainingMeals } from './count-meals';
import {
  Recipe,
  StoredMealSelection,
  SubmitCustomerOrderPayload,
} from '@tnmw/types';
import { isSelectedMeal } from '@tnmw/meal-planning';
import {
  container,
  header,
  headerText,
  youNeedToChoose,
} from './initial-selections.css';
import { goAheadAndSubmit } from './confirm-selections-container.css';
import { Meal } from './meal';

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
              const id = isSelectedMeal(item)
                ? item.recipe.id
                : item.chosenVariant;

              if (id in accum) {
                accum[id]++;
              }

              if (!(id in accum)) {
                accum[id] = 1;
              }
              return accum;
            }, {})
        : undefined;
    })
  );

const getOptionsWithSelections = (
  meals: MealCategory[],
  selectedMeals: ({ [id: string]: number } | undefined)[][],
  availableMeals: Meal[]
) =>
  meals.map((category, index) => ({
    ...category,
    selections: selectedMeals[index]
      .map((delivery) =>
        delivery
          ? Object.entries(delivery).flatMap(([id, count]) =>
              Array.from({ length: count }).map(
                () =>
                  availableMeals.find((meal) => meal.id === id) ?? {
                    isExtra: true,
                    id: '0',
                    description: '',
                    allergens: '',
                    name: id,
                  }
              )
            )
          : []
      )
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .map((delivery) => delivery.filter(hasThing)),
  }));

const MealSelections: FC<MealSelectionsProps> = (props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState(
    createDefaultSelectedThings(props.availableMeals, props.currentSelection)
  );

  console.log(selectedMeals);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [complete, setComplete] = useState(false);

  const availableMealCategoriesWithoutExtras = props.availableMeals.filter(
    (category) => !category.isExtra
  );

  const availableMealCategoriesWithoutExtrasIndexes =
    props.availableMeals.reduce<number[]>(
      (accum, item, index) => (item.isExtra ? accum : [...accum, index]),
      []
    );

  const selectedMealsWithoutExtras = selectedMeals.filter((meal, index) =>
    availableMealCategoriesWithoutExtrasIndexes.includes(index)
  );

  const availableMeals = props.availableMeals
    .filter((category) => !category.isExtra)
    .flatMap((category) => category.options.flat());

  const optionsWithSelectionsWithoutExtras = getOptionsWithSelections(
    availableMealCategoriesWithoutExtras,
    selectedMealsWithoutExtras,
    availableMeals
  );

  const optionsWithSelectionsWithExtras = getOptionsWithSelections(
    props.availableMeals,
    selectedMeals,
    availableMeals
  );

  const remainingWithoutExtras = remainingMeals(
    optionsWithSelectionsWithoutExtras.filter((category) => !category.isExtra)
  );

  const tabs =
    availableMealCategoriesWithoutExtras.length * defaultDeliveryDays.length;

  const [tabIndex, setTabIndex] = useState(0);

  const next = async () => {
    if (tabIndex < tabs - 1) {
      setTabIndex((index) => index + 1);
    } else if (!showConfirm) {
      setShowConfirm(true);
    } else {
      setSubmittingOrder(true);
      const payload: SubmitCustomerOrderPayload = {
        plan: props.currentSelection.id,
        sort: props.currentSelection.sort,
        deliveries: defaultDeliveryDays.map((day, index) => {
          return optionsWithSelectionsWithExtras.flatMap((category) =>
            category.selections[index]
              .map((recipe) => {
                const foundRecipe = props.recipes.find(
                  (straw) => recipe.id === straw.id
                );
                return foundRecipe
                  ? {
                      recipe: foundRecipe,
                      chosenVariant: category.title,
                    }
                  : {
                      chosenVariant: recipe.name,
                    };
              })
              // eslint-disable-next-line unicorn/no-array-callback-reference
              .filter(hasThing)
          );
        }),
      };

      await props.submitOrder(payload);
      setSubmittingOrder(false);
      setComplete(true);
    }
  };

  const prev = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else if (tabIndex > 0) {
      setTabIndex((index) => index - 1);
    }
  };

  const Label = styled('div')`
    margin-top: 1rem;
  `;

  const continueButtonDisabled =
    tabIndex === tabs - 1 && remainingWithoutExtras !== 0;

  const continueText = continueButtonDisabled
    ? 'Select more meals'
    : 'Continue';

  return props.availableMeals.length === 0 ? (
    <Label>
      <ParagraphText>
        It looks like you've not got any meals available yet. If this is wrong,
        get in touch with us at {CONTACT_EMAIL} to let us know
      </ParagraphText>
    </Label>
  ) : (
    <DivContainer>
      {!showConfirm ? (
        <div className={container}>
          <h2 className={header}>
            <span className={headerText}>Choose Your Meals</span>
            <Button
              size="large"
              onClick={prev}
              disabled={submittingOrder || complete}
            >
              Go Back
            </Button>
            <Button
              size="large"
              primary
              color="callToAction"
              onClick={next}
              disabled={continueButtonDisabled || submittingOrder || complete}
            >
              {showConfirm
                ? submittingOrder
                  ? 'Submitting...'
                  : 'Submit'
                : continueText}
            </Button>
          </h2>
          <p className={youNeedToChoose}>
            You need to choose {remainingWithoutExtras} meals
          </p>
          <InitialSelections
            {...props}
            availableMeals={props.availableMeals}
            remainingMeals={remainingWithoutExtras}
            selectedMeals={selectedMeals}
            categoriesThatAreNotExtrasIndexes={
              availableMealCategoriesWithoutExtrasIndexes
            }
            setSelectedMeals={setSelectedMeals}
            currentTabIndex={tabIndex}
            onChangeIndex={(index) => {
              setTabIndex(index);
            }}
          />
        </div>
      ) : (
        <div className={container}>
          {!complete ? (
            <h2 className={header}>
              <span className={headerText}>Confirm Your Order</span>
              <Button
                size="large"
                onClick={prev}
                disabled={submittingOrder || complete}
              >
                Go Back
              </Button>
              <Button
                size="large"
                primary
                color="callToAction"
                onClick={next}
                disabled={continueButtonDisabled || submittingOrder || complete}
              >
                {showConfirm
                  ? submittingOrder
                    ? 'Submitting...'
                    : 'Submit'
                  : continueText}
              </Button>
            </h2>
          ) : (
            <h2 className={header}>Thank You</h2>
          )}
          {!complete ? (
            <p className={goAheadAndSubmit}>
              If you are happy with your choices, go ahead and press submit
            </p>
          ) : (
            <p className={goAheadAndSubmit}>
              Your choices have been submitted!
            </p>
          )}
          <ConfirmSelections
            complete={complete}
            selectedMeals={optionsWithSelectionsWithExtras}
          />
        </div>
      )}
    </DivContainer>
  );
};

export default MealSelections;
