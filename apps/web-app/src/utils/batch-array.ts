export const batchArray = <T>(input: T[], batchSize: number): T[][] =>
  input.reduce<T[][]>(
    (accumulator, item) =>
      accumulator[accumulator.length - 1].length === batchSize
        ? [...accumulator, [item]]
        : [
            ...accumulator.slice(0, -1),
            [...accumulator[accumulator.length - 1], item],
          ],
    [[]]
  );
