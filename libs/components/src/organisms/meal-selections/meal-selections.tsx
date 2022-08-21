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
  Customer,
  Recipe,
  Alternate,
  StoredMealSelection,
  SubmitCustomerOrderPayload,
  BackendCustomer,
  PlannedCook,
  WeeklyCookPlan,
  WeeklyCookPlanWithoutCustomerPlans,
} from '@tnmw/types';
import {
  container,
  header,
  headerText,
  youNeedToChoose,
} from './initial-selections.css';
import { goAheadAndSubmit } from './confirm-selections-container.css';
import { Meal } from './meal';
import { MealPlanGeneratedForIndividualCustomer } from '@tnmw/types';
import { countRemainingMeals } from './count-remaining-meals';

export interface ChooseMealsCustomer {
  customisations?: BackendCustomer['customisations'];
}

export interface MealSelectionsProps {
  plan: WeeklyCookPlanWithoutCustomerPlans;
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  cooks: PlannedCook[];
  submitOrder: (payload: SubmitCustomerOrderPayload) => Promise<void>;
  recipes: Recipe[];
  customer: BackendCustomer;
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
  selection: MealPlanGeneratedForIndividualCustomer
) =>
  categories.map((category) =>
    defaultDeliveryDays.map((_, index) => {
      return selection.deliveries[index].plans
        .filter(
          (plan) => plan.status === 'active' && plan.name === category.title
        )
        .flatMap((plan) =>
          plan.status === 'active'
            ? plan.meals.map((meal) => ({ ...meal, name: plan.name }))
            : []
        )
        .reduce<{ [id: string]: number }>((accum, item) => {
          const id = item.isExtra ? item.name : item.recipe.id;

          if (id in accum) {
            accum[id]++;
          }

          if (!(id in accum)) {
            accum[id] = 1;
          }
          return accum;
        }, {});
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
  const [selectedMeals, setSelectedMeals] =
    useState<MealPlanGeneratedForIndividualCustomer>(props.currentSelection);

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [complete, setComplete] = useState(false);

  const customerPlans = props.currentSelection.customer.plans;

  const availableMealCategoriesWithoutExtras = customerPlans.filter(
    (category) => !category.isExtra
  );

  // const availableMeals = props.cooks.flatMap((cook) => cook.menu);

  // const optionsWithSelectionsWithoutExtras = getOptionsWithSelections(
  //   availableMealCategoriesWithoutExtras,
  //   selectedMealsWithoutExtras,
  //   availableMeals
  // );

  // const optionsWithSelectionsWithExtras = getOptionsWithSelections(
  //   props.availableMeals,
  //   selectedMeals,
  //   availableMeals
  // );

  const remaining = countRemainingMeals(selectedMeals, props.customer.plans);

  const totalRemaining = Object.values(remaining).reduce(
    (total, value) => total + value,
    0
  );

  const remainingBreakdownString =
    Object.values(remaining).length > 1
      ? ` - (${Object.entries(remaining)
          .map(([name, total]) => `${name}: ${total}`)
          .join(',')})`
      : ``;

  const remainingString = `You need to choose ${totalRemaining} meals${remainingBreakdownString}`;

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
      /*
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
      */
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

  // const continueButtonDisabled =
  //   tabIndex === tabs - 1 && remainingWithoutExtras !== 0;
  //
  const continueButtonDisabled = false;

  const continueText = continueButtonDisabled
    ? 'Select more meals'
    : 'Continue';

  return props.currentSelection.deliveries.length === 0 ? (
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
          <p className={youNeedToChoose}>{remainingString}</p>
          <InitialSelections
            {...props}
            currentSelection={selectedMeals}
            setSelectedMeals={setSelectedMeals}
            recipes={props.recipes}
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
          {/*
          <ConfirmSelections
            recipes={props.recipes}
            customer={props.customer}
            complete={complete}
            selectedMeals={optionsWithSelectionsWithExtras}
          /> */}
        </div>
      )}
    </DivContainer>
  );
};

export default MealSelections;
