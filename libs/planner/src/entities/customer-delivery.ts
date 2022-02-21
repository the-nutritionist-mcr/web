import { DaysOfWeek } from '../types';
import { Variant } from './variant';

export interface ICookDay {
  readonly dayOfWeek: DaysOfWeek;
  readonly eatingDaysCovered: ReadonlyArray<DaysOfWeek>;
}

export interface ISelection {
  readonly variant: Variant;
  readonly quantity: number;
}

export interface CustomerDelivery {
  readonly cookDay: ICookDay;
  readonly meals: ReadonlyArray<ISelection>;
}
