import { FC, Dispatch, SetStateAction } from 'react';
import MealCounter from './meal-counter';
import { SelectedThings } from './selected-things';
import { Meal } from './meal';
import { mealListGrid } from './meal-list.css';
import { Customer, Recipe } from '@tnmw/types';
import { getRealRecipe } from '@tnmw/meal-planning';
import { ChooseMealsCustomer } from './meal-selections';

interface MealListProps {
  things: Meal[];
  customer: ChooseMealsCustomer;
  recipes: Recipe[];
  selected: SelectedThings;
  setSelected: (things: SelectedThings) => void;
  max: number;
}

const MealList: FC<MealListProps> = (props) => {
  const total = Object.entries(props.selected).reduce(
    (accum, item) => accum + item[1],
    0
  );

  return (
    <div className={mealListGrid}>
      {props.things.map((thing) => {
        const realRecipe = getRealRecipe(thing, props.customer, props.recipes);
        return (
          <MealCounter
            key={thing.id}
            title={realRecipe.name ?? ''}
            description={realRecipe.description ?? ''}
            contains={thing.allergens}
            value={props.selected[thing.id] ?? 0}
            min={0}
            max={props.max - total + (props.selected[thing.id] ?? 0)}
            onChange={(newValue: number) =>
              props.setSelected({
                ...props.selected,
                [thing.id]: newValue,
              })
            }
          />
        );
      })}
    </div>
  );
};

export default MealList;
