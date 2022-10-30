import { batchArray } from './batch-array';

describe('batch array', () => {
  it('returns an empty first batch if passed in an empty array', () => {
    const actual = batchArray([], 10);
    expect(actual).toEqual([[]]);
  });

  it('returns a single batch if batchsize is greater than the size of the array', () => {
    const actual = batchArray(['foo', 'bar'], 10);
    expect(actual).toEqual([['foo', 'bar']]);
  });

  it('correctly divides an array of 4 into batches of 2', () => {
    const actual = batchArray(['foo', 'bar', 'baz', 'bash'], 2);
    expect(actual).toEqual([
      ['foo', 'bar'],
      ['baz', 'bash'],
    ]);
  });

  it("Handles lengths that aren't divisible correctly", () => {
    const actual = batchArray(
      ['foo', 'bar', 'baz', 'bash', 'foobar', 'blah', 'blob'],
      3
    );
    expect(actual).toEqual([
      ['foo', 'bar', 'baz'],
      ['bash', 'foobar', 'blah'],
      ['blob'],
    ]);
  });
});
