export interface BreakpointValue {
  start?: number;
  end?: number;
}

export interface Breakpoints {
  [name: string]: BreakpointValue;
}
