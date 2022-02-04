type NullToUndefined<T> = T extends null ? undefined : T;

type NullsConvertedToUndefined<T> = {
  [K in keyof T]: NullToUndefined<NullsConvertedToUndefined<T[K]>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertNullsToUndefined = <T extends { [key: string]: any }>(
  thing: T
): NullsConvertedToUndefined<T> =>
  // eslint-disable-next-line unicorn/no-reduce
  Object.keys(thing).reduce<T>((previous, key) => {
    const newValue =
      // eslint-disable-next-line no-nested-ternary
      thing[key] === null
        ? undefined
        : // eslint-disable-next-line unicorn/no-nested-ternary
        typeof thing[key] === 'object'
        ? convertNullsToUndefined(thing[key])
        : thing[key];
    return {
      ...previous,
      [key]: newValue,
    };
  }, thing);

export default convertNullsToUndefined;
