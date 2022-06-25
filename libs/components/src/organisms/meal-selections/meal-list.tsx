import { FC, Dispatch, SetStateAction } from 'react';
import MealCounter from './meal-counter';
import { SelectedThings } from './selected-things';
import { Meal } from './meal';
import { mealListGrid } from './meal-list.css';

interface MealListProps {
  things: Meal[];
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
      {props.things.map((thing) => (
        <MealCounter
          key={thing.id}
          title={thing.title}
          description={thing.description}
          contains={thing.contains}
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
      ))}
      {props.things.map((thing) => (
        <MealCounter
          key={thing.id}
          title={thing.title}
          description={thing.description}
          contains={thing.contains}
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
      ))}
    </div>
  );
};

export default MealList;
