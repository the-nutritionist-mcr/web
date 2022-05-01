import { Dispatch, SetStateAction } from 'react';
import { SelectedThings } from './selected-things';

export const setSelected = (
  selected: SelectedThings,
  selectedMeals: SelectedThings[][],
  categoryIndex: number,
  dayIndex: number,
  setSelectedMeals: Dispatch<SetStateAction<SelectedThings[][]>>
) => {
  const newSelectedMeals = [...selectedMeals[categoryIndex]];
  newSelectedMeals[dayIndex] = selected;
  const finalSelected = [...selectedMeals];
  finalSelected[categoryIndex] = newSelectedMeals;
  setSelectedMeals(finalSelected);
};
