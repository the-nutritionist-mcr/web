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
import { ChooseMealsCustomer } from './meal-selections';
import { Recipe } from '@tnmw/types';

interface ConfirmSelectionsProps {
  selectedMeals: MealCategoryWithSelections[];
  customer: ChooseMealsCustomer;
  recipes: Recipe[];
  complete: boolean;
}

export const ConfirmSelections = (props: ConfirmSelectionsProps) => {
  const total = countMeals(props.selectedMeals);

  return (
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
            <ConfirmDelivery
              customer={props.customer}
              recipes={props.recipes}
              deliveryNumber={index + 1}
              sections={sections}
            />
          );
        })}
      </div>
      <div className={confirmSelectionsImage}></div>
    </div>
  );
};
