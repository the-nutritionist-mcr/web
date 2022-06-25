import { Meal } from './meal';
import {
  deliveryNumberHeader,
  sectionContainer,
  mealSelectionLi,
  sectionHeader,
} from './confirm-delivery.css';

interface Section {
  name: string;
  meals: Meal[];
}

interface ConfirmDeliveryProps {
  deliveryNumber: number;
  sections: Section[];
}
export const ConfirmDelivery = (props: ConfirmDeliveryProps) => {
  return (
    <div>
      <h4 className={deliveryNumberHeader}>Delivery {props.deliveryNumber}</h4>
      {props.sections.map((section) => (
        <div className={sectionContainer}>
          <h5 className={sectionHeader}>{section.name}</h5>
          <ul>
            {section.meals.length === 0 ? (
              <li className={mealSelectionLi}>No meals</li>
            ) : (
              section.meals.map((meal) => (
                <li className={mealSelectionLi}>{meal.title}</li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
