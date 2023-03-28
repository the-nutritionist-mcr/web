import { Breakpoints } from '../types/breakpoints';

import { renderHook, act } from '@testing-library/react';
import { useBreakpoints } from './use-breakpoints';

const setWindowWidth = (value: number) =>
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value,
  });

describe('useBreakpoints', () => {
  it('defaults to the smallest breakpoint if misconfigured', () => {
    const breakpoints1: Breakpoints = {
      small: {
        end: 100,
      },
      large: {
        start: 501,
      },
      medium: {
        start: 300,
        end: 500,
      },
    };
    setWindowWidth(200);

    const { result: result1 } = renderHook(() => useBreakpoints(breakpoints1));
    expect(result1.current).toEqual('small');

    const breakpoints2: Breakpoints = {
      large: {
        start: 501,
      },
      medium: {
        start: 300,
        end: 500,
      },
      small: {
        end: 100,
      },
    };
    setWindowWidth(200);

    const { result: result2 } = renderHook(() => useBreakpoints(breakpoints2));
    expect(result2.current).toEqual('small');
  });

  describe('before any events are fired', () => {
    it('sets the breakpoint correctly for a breakpoint that has a start and an end', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(250);

      const { result } = renderHook(() => useBreakpoints(breakpoints));
      expect(result.current).toEqual('medium');
    });

    it('sets the breakpoint correctly for a breakpoint that has no start', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(23);

      const { result } = renderHook(() => useBreakpoints(breakpoints));
      expect(result.current).toEqual('small');
    });

    it('sets the breakpoint correctly for a breakpoint that has no end', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(2352);

      const { result } = renderHook(() => useBreakpoints(breakpoints));
      expect(result.current).toEqual('large');
    });
  });

  describe('after a resize event is fired', () => {
    it('sets the breakpoint correctly for a breakpoint that has a start and an end', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(124);

      const { result } = renderHook(() => useBreakpoints(breakpoints));

      act(() => {
        setWindowWidth(240);
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toEqual('medium');
    });

    it('sets the breakpoint correctly for a breakpoint that has no start', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(502);

      const { result } = renderHook(() => useBreakpoints(breakpoints));

      act(() => {
        setWindowWidth(100);
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toEqual('small');
    });

    it('sets the breakpoint correctly for a breakpoint that has no end', () => {
      const breakpoints: Breakpoints = {
        small: {
          end: 200,
        },
        medium: {
          start: 201,
          end: 500,
        },
        large: {
          start: 501,
        },
      };

      setWindowWidth(204);

      act(() => {
        setWindowWidth(123_123);
        window.dispatchEvent(new Event('resize'));
      });

      const { result } = renderHook(() => useBreakpoints(breakpoints));
      expect(result.current).toEqual('large');
    });
  });
});
