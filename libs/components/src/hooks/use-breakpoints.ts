import { Breakpoints } from '../types/breakpoints';

import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const findBreakpoint = (breakpoints: Breakpoints) => {
  const smallestEnd = Object.entries(breakpoints).reduce((accum, current) =>
    (current[1].end ?? 9_999_999) < (accum[1].end ?? 9_999_999)
      ? current
      : accum
  );

  if (!isBrowser) {
    return smallestEnd[0];
  }

  const betweenBreakpoint = Object.entries(breakpoints).find(([, values]) => {
    const start = values.start ?? 0;
    const end = values.end ?? 9_999_999;

    return window.innerWidth >= start && window.innerWidth <= end;
  });

  if (!betweenBreakpoint) {
    return smallestEnd[0];
  }

  return betweenBreakpoint[0];
};

export const useBreakpoints = (breakpoints: Breakpoints): string => {
  const [breakpoint, setBreakpoint] = useState('small');

  useEffect(() => {
    const handleResize = () => {
      if (isBrowser) {
        setBreakpoint(findBreakpoint(breakpoints));
      }
    };
    if (isBrowser) {
      window.addEventListener('resize', handleResize);
    }
    setBreakpoint(findBreakpoint(breakpoints));
    return () => {
      if (isBrowser) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [breakpoints]);

  return breakpoint;
};
