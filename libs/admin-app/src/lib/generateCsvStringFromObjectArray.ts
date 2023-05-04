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
  // This was working before. The types for Ramda are clearly hard work
  // I don't have time to fix it
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  convertTypeToString('number'),
  convertTypeToString('boolean'),
  escapeQuotes,
  surroundFieldsWithSpecialCharactersInQuotes([',', '"', '\n', '\r'])
);

const createCsvRowString = (fields: ValueType[]) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fields.map((element) => processField(element)).join(',');

interface ArbitraryObjectType {
  [key: string]: ValueType;
}

export const generateIndividualCsv = (
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

  return Buffer.from(`${headerRow}\r\n${rows}`, 'utf8').toString();
};

export const generateMealsCsvFromObjectArray = (
  inputObjectArray: ReadonlyArray<ArbitraryObjectType>
): { filename: string; data: string }[] => {
  const flags = inputObjectArray.reduce<ReadonlyArray<ArbitraryObjectType>>(
    (accum, row) => {
      const customisations = row['customisations'];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { originalName, ...restOfData } = row;
      if (customisations) {
        return [...accum, restOfData];
      }
      return accum;
    },
    []
  );

  const mealNameMap = inputObjectArray.reduce<
    Record<string, ReadonlyArray<ArbitraryObjectType>>
  >((accum, row) => {
    const { originalName, ...restOfData } = row;
    const name = originalName ?? row['mealName'];
    if (!(typeof name === 'string')) {
      throw new TypeError('originalName or mealName not present');
    }
    accum[name] = [...(accum[name] ?? []), restOfData];
    return accum;
  }, {});

  return Object.entries({ ...mealNameMap, ['Custom Flags']: flags }).map(
    ([key, value]) => ({
      filename: key,
      data: generateIndividualCsv(value),
    })
  );
};
