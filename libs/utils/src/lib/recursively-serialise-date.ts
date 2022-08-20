type DateLike = { getMonth: () => number };
type SerialisedDateLike = { $type: 'date'; value: number };

const isDate = (foo: unknown): foo is Date => {
  return typeof (foo as Date)?.getMonth === 'function';
};

const isSerialisedDate = (
  foo: unknown
): foo is { $type: 'date'; value: number } => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (foo as any)?.value === 'string' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (foo as any)?.['$type'] === 'date'
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
const isObjectType = (foo: unknown): foo is {} => {
  return foo !== null && typeof foo === 'object';
};

export type SerialisedDate<T> = {
  [K in keyof T]: T[K] extends DateLike
    ? { $type: 'date'; value: number }
    : SerialisedDate<T[K]>;
};

export type UnserialisedDate<T> = {
  [K in keyof T]: T[K] extends SerialisedDateLike ? Date : SerialisedDate<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const recursivelySerialiseDate = <T extends {}>(
  obj: T
): SerialisedDate<T> => {
  const returnVal = Object.entries<DateLike | unknown>(obj).reduce<
    Partial<SerialisedDate<T>>
  >((accum, [key, value]) => {
    if (isDate(value)) {
      // eslint-disable-next-line fp/no-mutating-assign
      return Object.assign(accum, {
        [key]: { ['$type']: 'date', value: String(value.getTime()) },
      });
    }

    if (isObjectType(value)) {
      // eslint-disable-next-line fp/no-mutating-assign
      return Object.assign(accum, { [key]: recursivelySerialiseDate(value) });
    }

    // eslint-disable-next-line fp/no-mutating-assign
    return Object.assign(accum, { [key]: value });
  }, obj);

  // TODO need to write type assertion here
  return returnVal as SerialisedDate<T>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const recursivelyDeserialiseDate = <T extends {}>(
  obj: SerialisedDate<T>
): T => {
  const returnVal = Object.entries(obj).reduce<Partial<T>>(
    (accum, [key, value]) => {
      if (isSerialisedDate(value)) {
        // eslint-disable-next-line fp/no-mutating-assign
        return Object.assign(accum, {
          [key]: new Date(Number(value.value)),
        });
      }

      if (isObjectType(value)) {
        // eslint-disable-next-line fp/no-mutating-assign
        return Object.assign(accum, {
          [key]: recursivelyDeserialiseDate(value),
        });
      }

      // eslint-disable-next-line fp/no-mutating-assign
      return Object.assign(accum, { [key]: value });
    },
    obj as unknown as Partial<T>
  );

  return returnVal as T;
};
