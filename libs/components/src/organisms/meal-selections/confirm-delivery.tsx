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
  deliveryContainer,
} from './confirm-delivery.css';
import { Recipe } from '@tnmw/types';
import { ChooseMealsCustomer } from './meal-selections';
import { getRealRecipe } from '@tnmw/meal-planning';

interface Section {
  name: string;
  meals: Meal[];
}

interface ConfirmDeliveryProps {
  deliveryNumber: number;
  sections: Section[];
  customer: ChooseMealsCustomer;
  recipes: Recipe[];
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
    <div className={deliveryContainer}>
      <h4 className={deliveryNumberHeader}>Delivery {props.deliveryNumber}</h4>
      {props.sections.map((section) => (
        <div className={sectionContainer}>
          <h5 className={sectionHeader}>{section.name}</h5>
          <ul>
            {section.meals.length === 0 ? (
              <li className={noMealsLi}>Empty</li>
            ) : (
              combineDuplicates(section.meals).map((meal) => {
                const realMeal = getRealRecipe(
                  meal[0],
                  props.customer,
                  props.recipes
                );
                return (
                  <li className={mealSelectionLi}>
                    <div className={itemCount}>
                      <div className={itemCountNumber}>{meal[1]}</div>
                    </div>
                    <div className={mealTitle}>
                      {realMeal?.name?.toLocaleLowerCase()}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
