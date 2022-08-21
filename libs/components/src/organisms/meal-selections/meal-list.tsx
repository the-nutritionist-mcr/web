import MealCounter from './meal-counter';
import { mealListGrid } from './meal-list.css';
import { getRealRecipe } from '@tnmw/meal-planning';
import {
  ActivePlanWithMeals,
  BackendCustomer,
  DeliveryItem,
  Recipe,
  StandardPlan,
} from '@tnmw/types';
import { useEffect, useState } from 'react';
import { countsFromPlans } from './count-from-plans';
import { planFromCounts } from './plan-from-counts';

interface MealListProps {
  things: Recipe[];
  customer: BackendCustomer;
  recipes: Recipe[];
  plan: StandardPlan;
  selected: ActivePlanWithMeals;
  setSelected: (things: ActivePlanWithMeals) => void;
  max: number;
}

const MealList = (props: MealListProps) => {
  const [counts, setCounts] = useState(countsFromPlans(props.selected));

  useEffect(() => {
    props.setSelected({
      ...props.selected,
      meals: planFromCounts(counts, props.things, props.plan.name),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);

  const max = props.max - props.selected.meals.length;

  return (
    <div className={mealListGrid}>
      {props.things.map((thing) => {
        const realRecipe = getRealRecipe(thing, props.customer, props.recipes);

        const countOfThisRecipe = props.selected.meals.filter(
          (meal) => !meal.isExtra && meal.recipe.id === thing.id
        ).length;

        return (
          <MealCounter
            key={thing.id}
            title={realRecipe.name ?? ''}
            description={realRecipe.description ?? ''}
            contains={thing.allergens}
            value={counts[thing.id]}
            min={0}
            max={max + countOfThisRecipe}
            onChange={(value) => {
              setCounts({ ...counts, [thing.id]: value });
              props.setSelected({
                ...props.selected,
                meals: planFromCounts(counts, props.things, props.plan.name),
              });
            }}
          />
        );
      })}
    </div>
  );
};

export default MealList;
