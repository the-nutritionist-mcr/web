import { Meal } from './meal';
import {
  deliveryNumberHeader,
  sectionContainer,
  mealSelectionLi,
  sectionHeader,
  noMealsLi,
  itemCount,
  mealTitle,
  itemCountNumber,
} from './confirm-delivery.css';

interface Section {
  name: string;
  meals: Meal[];
}

interface ConfirmDeliveryProps {
  deliveryNumber: number;
  sections: Section[];
}

const combineDuplicates = (meals: Meal[]): [Meal, number][] => {
  return meals.reduce<[Meal, number][]>((accum, meal) => {
    const index = accum.findIndex((item) => item[0].id === meal.id);
    if (index !== -1) {
      accum[index][1]++;
    } else {
      // eslint-disable-next-line fp/no-mutating-methods
      accum.push([meal, 1]);
    }
    return accum;
  }, []);
};

export const ConfirmDelivery = (props: ConfirmDeliveryProps) => {
  return (
    <div>
      <h4 className={deliveryNumberHeader}>Delivery {props.deliveryNumber}</h4>
      {props.sections.map((section) => (
        <div className={sectionContainer}>
          <h5 className={sectionHeader}>{section.name}</h5>
          <ul>
            {section.meals.length === 0 ? (
              <li className={noMealsLi}>No meals in this delivery</li>
            ) : (
              combineDuplicates(section.meals).map((meal) => (
                <li className={mealSelectionLi}>
                  <div className={itemCount}>
                    <div className={itemCountNumber}>{meal[1]}</div>
                  </div>
                  <div className={mealTitle}>
                    {meal[0].title.toLocaleLowerCase()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
