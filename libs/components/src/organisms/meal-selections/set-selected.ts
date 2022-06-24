import { SelectedMeals } from './initial-selections';
import { SelectedThings } from './selected-things';

export const setSelected = (
  selected: SelectedThings,
  selectedMeals: SelectedThings[][],
  categoryIndex: number,
  dayIndex: number,
  setSelectedMeals: (selected: SelectedMeals) => void
) => {
  const newSelectedMeals = [...selectedMeals[categoryIndex]];
  newSelectedMeals[dayIndex] = selected;
  const finalSelected = [...selectedMeals];
  finalSelected[categoryIndex] = newSelectedMeals;
  setSelectedMeals(finalSelected);
};
