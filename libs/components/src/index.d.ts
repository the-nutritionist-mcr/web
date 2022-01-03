import { Breakpoints } from './breakpoints';

import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      buttonBlack: string;
      labelText: string;
    };
    menubarHeight: number;
    breakpoints: Breakpoints;
  }
}
