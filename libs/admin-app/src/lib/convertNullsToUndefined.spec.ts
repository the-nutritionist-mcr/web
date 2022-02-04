import convertNullsToUndefined from './convertNullsToUndefined';

describe('convert nulls to undefined', () => {
  it('Returns an empty object unchanged', () => {
    const actual = convertNullsToUndefined({});

    expect(actual).toEqual({});
  });

  it('Returns a moderately complex object without nulls unchanged', () => {
    const input = {
      foo: 'foo',
      bar: undefined,
      baz: {
        bash: 'bof',
        bop: 'bip',
      },
    };
    const actual = convertNullsToUndefined(input);

    expect(actual).toEqual(input);
  });

  it('Returns a single layer object with nulls converted to undefineds', () => {
    const input = {
      foo: 'foo',
      bar: null,
    };
    const actual = convertNullsToUndefined(input);

    const expected = {
      foo: 'foo',
      bar: undefined,
    };
    expect(actual).toEqual(expected);
  });

  it('Returns a more complex object with nulls converted to undefined', () => {
    const input = {
      foo: 'foo',
      bar: null,

      baz: {
        foo: 'foo',
        barz: null,
        bar: {
          blop: 'bloop',
          blif: 'blah',
          baz: null,
        },
      },
    };

    const actual = convertNullsToUndefined(input);

    const expected = {
      foo: 'foo',
      bar: undefined,

      baz: {
        foo: 'foo',
        barz: undefined,
        bar: {
          blop: 'bloop',
          blif: 'blah',
          baz: undefined,
        },
      },
    };
    expect(actual).toEqual(expected);
  });
});
