import {
  confirmSelectionsContainer,
  confirmSelectionsGrid,
  confirmSelectionsImage,
  container,
  countHeader,
  divider,
  goAheadAndSubmit,
  header,
  summaryHeader,
} from './confirm-selections-container.css';
import { MealCategoryWithSelections } from './meal-category';
import { defaultDeliveryDays } from '@tnmw/config';
import { ConfirmDelivery } from './confirm-delivery';
import { countMeals } from './count-meals';

interface ConfirmSelectionsProps {
  selectedMeals: MealCategoryWithSelections[];
  complete: boolean;
}

export const ConfirmSelections = (props: ConfirmSelectionsProps) => {
  const total = countMeals(props.selectedMeals);

  return (
    <div className={container}>
      {!props.complete ? (
        <h2 className={header}>Confirm Your Order</h2>
      ) : (
        <h2 className={header}>Thank You</h2>
      )}
      {!props.complete ? (
        <p className={goAheadAndSubmit}>
          If you are happy with your choices, go ahead and press submit
        </p>
      ) : (
        <p className={goAheadAndSubmit}>Your choices have been submitted!</p>
      )}
      <div className={confirmSelectionsGrid}>
        <div className={confirmSelectionsContainer}>
          <h3 className={summaryHeader}>Your Selections</h3>
          <hr className={divider} />
          <h2 className={countHeader}>{total} meals selected</h2>
          {defaultDeliveryDays.map((_, index) => {
            const sections = props.selectedMeals.map((category) => ({
              name: category.title,
              meals: category.selections[index],
            }));

            return (
              <ConfirmDelivery deliveryNumber={index + 1} sections={sections} />
            );
          })}
        </div>
        <div className={confirmSelectionsImage}></div>
      </div>
    </div>
  );
};
