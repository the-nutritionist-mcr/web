import { Recipe } from '@tnmw/types';
import { Meal } from './meal';

interface Section {
  name: string;
  meals: Meal[];
  isExtra: boolean;
}

interface ConfirmDeliveryProps {
  deliveryNumber: number;
  sections: Section[];
}
export const ConfirmDelivery = (props: ConfirmDeliveryProps) => {
  return (
    <div>
      <h4>Delivery {props.deliveryNumber}</h4>
      {props.sections.map((section) => (
        <div>
          <h5>{section.name}</h5>
          <ul>
            {section.meals.length === 0 ? (
              <li>No meals</li>
            ) : (
              section.meals.map((meal) => (
                <li>{section.isExtra ? section.name : meal.title}</li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
