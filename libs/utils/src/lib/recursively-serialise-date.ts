const isDate = (foo: unknown): foo is Date => {
  return typeof (foo as Date)?.getMonth === 'function';
};

const isSerialisedDate = (
  foo: unknown
): foo is { $type: 'date'; value: number } => {
  return (
    typeof (foo as any)?.value === 'string' &&
    (foo as any)?.['$type'] === 'date'
  );
};

const isObjectType = (foo: unknown): foo is ObjectType => {
  return foo !== null && typeof foo === 'object';
};

type ObjectType = Record<string | number | symbol, unknown>;

export const recursivelySerialiseDate = <T>(obj: T): T => {
  return Object.entries(obj).reduce((accum, [key, value]) => {
    if (isDate(value)) {
      return Object.assign(accum, {
        [key]: { ['$type']: 'date', value: String(value.getTime()) },
      });
    }

    if (isObjectType(value)) {
      return Object.assign(accum, { [key]: recursivelySerialiseDate(value) });
    }

    return Object.assign(accum, { [key]: value });
  }, obj);
};

export const recursivelyDeserialiseDate = <T>(obj: T): T => {
  return Object.entries(obj).reduce((accum, [key, value]) => {
    if (isSerialisedDate(value)) {
      return Object.assign(accum, {
        [key]: new Date(Number(value.value)),
      });
    }

    if (isObjectType(value)) {
      return Object.assign(accum, { [key]: recursivelyDeserialiseDate(value) });
    }

    return Object.assign(accum, { [key]: value });
  }, obj);
};
