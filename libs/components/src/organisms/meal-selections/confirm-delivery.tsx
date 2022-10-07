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
import { ActivePlanWithMeals, BackendCustomer, Recipe } from '@tnmw/types';
import { getRealRecipe } from '@tnmw/meal-planning';
import { countsFromPlans } from './count-from-plans';
import { getDeliveryLabel } from './get-delivery-label';

interface Section {
  name: string;
  meals: ActivePlanWithMeals;
}

interface ConfirmDeliveryProps {
  deliveryNumber: number;
  sections: Section[];
  customer: BackendCustomer;
  recipes: Recipe[];
}

const getMealTitle = (
  id: string,
  recipes: Recipe[],
  customer: BackendCustomer
) => {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) {
    return id.toLocaleLowerCase();
  }
  const realMeal = getRealRecipe(recipe, customer, recipes);

  return realMeal?.name?.toLocaleLowerCase();
};

export const ConfirmDelivery = (props: ConfirmDeliveryProps) => {
  return (
    <div className={deliveryContainer}>
      <h4 className={deliveryNumberHeader}>
        {getDeliveryLabel(props.customer, props.deliveryNumber)}
      </h4>
      {props.sections.map((section) => (
        <div className={sectionContainer}>
          <h5 className={sectionHeader}>{section.name}</h5>
          <ul>
            {section.meals.meals.length === 0 ? (
              <li className={noMealsLi}>Empty</li>
            ) : (
              Object.entries(countsFromPlans(section.meals)).flatMap(
                ([id, count]) => {
                  return (
                    <li className={mealSelectionLi}>
                      <div className={itemCount}>
                        <div className={itemCountNumber}>{count}</div>
                      </div>
                      <div className={mealTitle}>
                        {getMealTitle(id, props.recipes, props.customer)}
                      </div>
                    </li>
                  );
                }
              )
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};
