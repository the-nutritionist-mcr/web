import { Breakpoints } from '../types/breakpoints';

export interface Theme {
  colors: {
    buttonBlack: string;
    labelText: string;
    callToAction: string;
  };
  menubarHeight: number;
  breakpoints: Breakpoints;
}
