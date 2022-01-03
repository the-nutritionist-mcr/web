import { Theme as ComponentTheme } from "@tnmw/components"

declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ReactComponent: any;
  export default content;
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ComponentTheme {}
}
