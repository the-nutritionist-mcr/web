import { curry, pipe } from "ramda";
/**
 * Implementation is based on https://tools.ietf.org/html/rfc4180#section-2
 */

type ValueType = string | number | boolean | undefined;

const containsStringOf = (field: string, chars: string[]) =>
  chars.some(char => field.includes(char));

const convertTypeToString = curry(
  (type: ValueType, field: string): ValueType =>
    typeof field === type ? String(field) : field
);

const surroundFieldsWithSpecialCharactersInQuotes = curry(
  (chars: string[], field: string) =>
    containsStringOf(field, chars) ? `"${field}"` : field
);

const escapeQuotes = (field: string | undefined) =>
  field?.replace(/"/gu, '""') ?? "";

const processField = pipe(
  convertTypeToString("number"),
  convertTypeToString("boolean"),
  escapeQuotes,
  surroundFieldsWithSpecialCharactersInQuotes([",", '"', "\n", "\r"])
);

const createCsvRowString = (fields: ValueType[]) =>
  fields.map(processField).join(",");

interface ArbitraryObjectType {
  [key: string]: ValueType;
}

const generateCsvStringFromObjectArray = (
  inputObjectArray: ReadonlyArray<ArbitraryObjectType>
): string => {
  if (inputObjectArray.length === 0) {
    throw new Error(
      "inputObjectArray.length must have a length greater than zero"
    );
  }

  const columnHeaders = Object.keys(inputObjectArray[0]);

  const rows = inputObjectArray
    .map(row =>
      createCsvRowString(columnHeaders.map(columnHeader => row[columnHeader]))
    )
    .join("\r\n");

  const headerRow = createCsvRowString(columnHeaders);

  return `${headerRow}\r\n${rows}`;
};

export default generateCsvStringFromObjectArray;
