/* eslint-disable @typescript-eslint/no-explicit-any */
import { Theme as ComponentTheme } from "@tnmw/components"
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '@emotion/react' {
  export interface Theme extends ComponentTheme {
  }
}
