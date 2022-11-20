import { curry, pipe } from 'ramda';
/**
 * Implementation is based on https://tools.ietf.org/html/rfc4180#section-2
 */

type ValueType = string | number | boolean | undefined;

const containsStringOf = (field: string, chars: string[]) =>
  chars.some((char) => field.includes(char));

const convertTypeToString = curry(
  (type: ValueType, field: string): ValueType =>
    typeof field === type ? String(field) : field
);

const surroundFieldsWithSpecialCharactersInQuotes = curry(
  (chars: string[], field: string) =>
    containsStringOf(field, chars) ? `"${field}"` : field
);

const escapeQuotes = (field: string | undefined) =>
  field?.replace(/"/gu, '""') ?? '';

const processField = pipe(
  convertTypeToString('number'),
  convertTypeToString('boolean'),
  // This was working before. The types for Ramda are clearly hard work
  // I don't have time to fix it
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  escapeQuotes,
  surroundFieldsWithSpecialCharactersInQuotes([',', '"', '\n', '\r'])
);

const createCsvRowString = (fields: ValueType[]) =>
  // eslint-disable-next-line unicorn/no-array-callback-reference
  fields.map(processField).join(',');

interface ArbitraryObjectType {
  [key: string]: ValueType;
}

const generateIndividualCsv = (
  inputObjectArray: ReadonlyArray<ArbitraryObjectType>
) => {
  if (inputObjectArray.length === 0) {
    throw new Error(
      'inputObjectArray.length must have a length greater than zero'
    );
  }

  const columnHeaders = Object.keys(inputObjectArray[0]);

  const rows = inputObjectArray
    .map((row) =>
      // eslint-disable-next-line security/detect-object-injection
      createCsvRowString(columnHeaders.map((columnHeader) => row[columnHeader]))
    )
    .join('\r\n');

  const headerRow = createCsvRowString(columnHeaders);

  return `${headerRow}\r\n${rows}`;
};

const generateCsvStringFromObjectArray = (
  inputObjectArray: ReadonlyArray<ArbitraryObjectType>
): { filename: string; data: string }[] => {
  const flags = inputObjectArray.reduce<ReadonlyArray<ArbitraryObjectType>>(
    (accum, row) => {
      const customisations = row['customisations'];
      if (customisations) {
        return [...accum, row];
      }
      return accum;
    },
    []
  );

  const mealNameMap = inputObjectArray.reduce<
    Record<string, ReadonlyArray<ArbitraryObjectType>>
  >((accum, row) => {
    const name = row['mealName'];
    if (!(typeof name === 'string')) {
      throw new TypeError('mealName not present');
    }
    accum[name] = [...(accum[name] ?? []), row];
    return accum;
  }, {});

  return Object.entries({ ...mealNameMap, ['Custom Flags']: flags }).map(
    ([key, value]) => ({
      filename: key,
      data: generateIndividualCsv(value),
    })
  );
};

export default generateCsvStringFromObjectArray;
