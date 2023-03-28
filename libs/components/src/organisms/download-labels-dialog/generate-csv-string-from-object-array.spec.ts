import generateCsvStringFromObjectArray from './generate-csv-string-from-object-array';
describe('Generate CSV string', () => {
  it('Throws an error if there is no rows', () => {
    expect(() => generateCsvStringFromObjectArray([])).toThrowError(
      new Error('inputObjectArray.length must have a length greater than zero')
    );
  });

  it('creates empty cells where the value is undefined', () => {
    const bar = [
      {
        foo: undefined,
        baz: 'bap',
      },
    ];

    const result = generateCsvStringFromObjectArray(bar);

    const splitResult = result[0].data.split('\r\n');
    expect(splitResult[1]).toEqual(',bap');
  });

  it('generates rows separated with CRLF', () => {
    const bar = [
      {
        foo: 'bar',
        baz: 'bap',
      },
    ];

    const result = generateCsvStringFromObjectArray(bar);

    const splitResult = result[0].data.split('\r\n');
    expect(splitResult).toHaveLength(2);
  });

  it('Generates a csv string containing the key names as the header row', () => {
    const bar = [
      {
        foo: 'bar',
        baz: 'bap',
      },
    ];

    const result = generateCsvStringFromObjectArray(bar);

    const splitResult = result[0].data.split('\r\n');
    expect(splitResult[0]).toEqual('foo,baz');
  });

  it('Generates a csv string containing the values of a few rows correctly', () => {
    const bar = [
      {
        foo: 'bar',
        baz: 'bap',
      },
      {
        foo: 'bap1',
        baz: 'bap2',
      },
      {
        foo: 'bif',
        baz: 'boo',
      },
    ];

    const result = generateCsvStringFromObjectArray(bar);

    const splitResult = result[0].data.split('\r\n');
    expect(splitResult[1]).toEqual('bar,bap');
    expect(splitResult[2]).toEqual('bap1,bap2');
    expect(splitResult[3]).toEqual('bif,boo');
  });

  it('Doubles up double quotes contained within fields', () => {
    const bar = [
      {
        foo: `bap"1`,
        baz: `bap2`,
      },
      {
        foo: `b"i"f`,
        baz: `b""oo`,
      },
    ];

    const result = generateCsvStringFromObjectArray(bar);

    expect(result).toEqual(`foo,baz\r\n"bap""1",bap2\r\n"b""i""f","b""""oo"`);
  });

  it.each([
    ['CRFL', '\r\n'],
    ['commas', ','],
  ])(
    'fields containing %s are always enclosed double quotes. Others are not.',
    (name: string, character: string) => {
      const bar = [
        {
          foo: `${character}bar`,
          baz: 'bap',
        },
        {
          foo: 'bap1',
          baz: `bap${character}2`,
        },
        {
          foo: `bap${character}1`,
          baz: `bap${character}2`,
        },
        {
          foo: 'bif',
          baz: 'boo',
        },
      ];

      const result = generateCsvStringFromObjectArray(bar);

      expect(result).toEqual(
        `foo,baz\r\n"${character}bar",bap\r\nbap1,"bap${character}2"\r\n"bap${character}1","bap${character}2"\r\nbif,boo`
      );
    }
  );
});
