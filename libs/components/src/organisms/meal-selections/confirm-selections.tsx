import { SelectedMeals } from './initial-selections';
import {
  confirmSelectionsContainer,
  confirmSelectionsGrid,
  confirmSelectionsImage,
  countHeader,
  divider,
  summaryHeader,
} from './confirm-selections-container.css';
import { MealCategoryWithSelections } from './meal-category';
import { defaultDeliveryDays } from '@tnmw/config';
import { ConfirmDelivery } from './confir-delivery';

interface ConfirmSelectionsProps {
  selectedMeals: MealCategoryWithSelections[];
}

export const countMeals = (categories: MealCategoryWithSelections[]) =>
  categories.reduce(
    (accumcategory, category) =>
      accumcategory +
      category.selections.reduce(
        (accum, delivery) =>
          accum + delivery.reduce((accum2, meal) => accum2 + 1, 0),
        0
      ),
    0
  );

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
            <ConfirmDelivery deliveryNumber={index + 1} sections={sections} />
          );
        })}
      </div>
      <div className={confirmSelectionsImage}></div>
    </div>
  );
};
