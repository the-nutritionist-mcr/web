interface BreakpointValue {
  start?: number;
  end?: number;
}

interface Breakpoints {
  [name: string]: BreakpointValue;
}
