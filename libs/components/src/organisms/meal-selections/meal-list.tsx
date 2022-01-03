import { FC, Dispatch, SetStateAction } from 'react';
import MealCounter from './meal-counter';
import { SelectedThings } from './selected-things';
import { Meal } from './meal';
import styled from '@emotion/styled';

interface MealListProps {
  things: Meal[];
  selected: SelectedThings;
  setSelected: Dispatch<SetStateAction<SelectedThings>>;
  max: number;
}

const FlexBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
`;

const MealList: FC<MealListProps> = (props) => {
  const total = Object.entries(props.selected).reduce(
    (accum, item) => accum + item[1],
    0
  );

  return (
    <FlexBox>
      {props.things.map((thing) => (
        <MealCounter
          key={thing.id}
          title={thing.title}
          description={thing.description}
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
    </FlexBox>
  );
};

export default MealList;
