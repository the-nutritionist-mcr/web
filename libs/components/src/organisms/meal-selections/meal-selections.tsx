import { FC, useState } from 'react';
import styled from '@emotion/styled';
import { defaultDeliveryDays } from '@tnmw/config';
import { Button } from '../../atoms';
import { CONTACT_EMAIL } from '@tnmw/constants';
import { ParagraphText } from '@tnmw/components';
import { InitialSelections } from './initial-selections';
import { ConfirmSelections } from './confirm-selections';
import {
  Recipe,
  BackendCustomer,
  PlannedCook,
  WeeklyCookPlanWithoutCustomerPlans,
} from '@tnmw/types';
import {
  container,
  header,
  headerButtons,
  headerText,
  youNeedToChoose,
} from './initial-selections.css';
import { goAheadAndSubmit } from './confirm-selections-container.css';
import { MealPlanGeneratedForIndividualCustomer } from '@tnmw/types';
import { countRemainingMeals } from './count-remaining-meals';

export interface ChooseMealsCustomer {
  customisations?: BackendCustomer['customisations'];
}

export interface MealSelectionsProps {
  plan: WeeklyCookPlanWithoutCustomerPlans;
  currentSelection: MealPlanGeneratedForIndividualCustomer;
  cooks: PlannedCook[];
  submitOrder: (
    payload: MealPlanGeneratedForIndividualCustomer
  ) => Promise<void>;
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

  const remainingWithoutExtras = countRemainingMeals(
    selectedMeals,
    props.customer.plans
  );

  const totalRemaining = Object.values(remainingWithoutExtras).reduce(
    (total, value) => total + value,
    0
  );

  const remainingBreakdownString =
    Object.values(remainingWithoutExtras).length > 1
      ? ` - (${Object.entries(remainingWithoutExtras)
          .map(([name, total]) => `${total} ${name}`)
          .join(', ')})`
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
      await props.submitOrder({ ...selectedMeals, wasUpdatedByCustomer: true });
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

  const continueButtonDisabled = tabIndex === tabs - 1 && totalRemaining !== 0;

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
            <div className={headerButtons}>
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
            </div>
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
          <ConfirmSelections
            recipes={props.recipes}
            customer={props.customer}
            complete={complete}
            selectedMeals={selectedMeals}
          />
        </div>
      )}
    </DivContainer>
  );
};

export default MealSelections;
