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

interface MealListProps {
  things: Recipe[];
  customer: BackendCustomer;
  recipes: Recipe[];
  plan: StandardPlan;
  selected: ActivePlanWithMeals;
  setSelected: (things: ActivePlanWithMeals) => void;
  max: number;
}

type Counts = {
  [key: string]: number;
};

const planFromCounts = (
  counts: Counts,
  recipes: Recipe[],
  chosenVariant: string
): DeliveryItem[] =>
  Object.entries(counts)
    .flatMap(([id, count]) => {
      return Array.from({ length: count }, () =>
        recipes.find((recipe) => recipe.id === id)
      );
    })
    .flatMap((recipe) =>
      recipe ? [{ recipe, isExtra: false, chosenVariant }] : []
    );

function countsFromPlans(plan: ActivePlanWithMeals) {
  return plan.meals.reduce<Counts>((accum, meal) => {
    if (meal.isExtra) {
      return {};
    }
    const id = meal.recipe.id;

    return id in accum
      ? { ...accum, [id]: accum[id] + 1 }
      : { ...accum, [id]: 1 };
  }, {});
}

const MealList = (props: MealListProps) => {
  const [counts, setCounts] = useState<Counts>(countsFromPlans(props.selected));

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
