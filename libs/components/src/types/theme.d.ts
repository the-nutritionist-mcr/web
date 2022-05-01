import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      callToAction: string;
      buttonBlack: string;
      labelText: string;
    };
    menubarHeight: number;
    breakpoints: Breakpoints;
  }
}
