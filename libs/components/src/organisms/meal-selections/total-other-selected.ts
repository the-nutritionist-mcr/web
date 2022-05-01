import { SelectedThings } from './selected-things';

export const totalOtherSelected = (
  selectedMeals: SelectedThings[][],
  categoryIndex: number,
  dayIndex: number
) =>
  selectedMeals[categoryIndex]
    .filter((_, index) => dayIndex !== index)
    .reduce((accum, entry) => {
      return (
        Object.entries(entry).reduce((pairAccum, pairEntry) => {
          return pairEntry[1] + pairAccum;
        }, 0) + accum
      );
    }, 0);
