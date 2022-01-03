import { useLayoutEffect, useState } from 'react';
const isBrowser = typeof window !== 'undefined';
const findBreakpoint = (breakpoints) => {
    const smallestEnd = Object.entries(breakpoints).reduce((accum, current) => {
        var _a, _b;
        return ((_a = current[1].end) !== null && _a !== void 0 ? _a : 9999999) < ((_b = accum[1].end) !== null && _b !== void 0 ? _b : 9999999)
            ? current
            : accum;
    });
    if (!isBrowser) {
        return smallestEnd[0];
    }
    const betweenBreakpoint = Object.entries(breakpoints).find(([, values]) => {
        var _a, _b;
        const start = (_a = values.start) !== null && _a !== void 0 ? _a : 0;
        const end = (_b = values.end) !== null && _b !== void 0 ? _b : 9999999;
        return window.innerWidth >= start && window.innerWidth <= end;
    });
    if (!betweenBreakpoint) {
        return smallestEnd[0];
    }
    return betweenBreakpoint[0];
};
const serverSideUseLayoutEffectShim = (callback) => callback();
const effectHook = isBrowser ? useLayoutEffect : serverSideUseLayoutEffectShim;
export const useBreakpoints = (breakpoints) => {
    const [breakpoint, setBreakpoint] = useState(findBreakpoint(breakpoints));
    effectHook(() => {
        const handleResize = () => {
            if (isBrowser) {
                setBreakpoint(findBreakpoint(breakpoints));
            }
        };
        if (isBrowser) {
            window.addEventListener('resize', handleResize);
        }
        return () => {
            if (isBrowser) {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, [breakpoints]);
    return breakpoint;
};
//# sourceMappingURL=use-breakpoints.js.map