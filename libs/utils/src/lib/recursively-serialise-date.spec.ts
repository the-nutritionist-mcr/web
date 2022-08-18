import {
  recursivelySerialiseDate,
  recursivelyDeserialiseDate,
} from './recursively-serialise-date';

describe('recursively-de-serialise', () => {
  it('returns an empty object given an empty object', () => {
    const result = recursivelyDeserialiseDate({});

    expect(result).toEqual({});
  });

  it('deserialises a date on the first level', () => {
    const result = recursivelyDeserialiseDate({
      foo: {
        $type: 'date',
        value: '1660676547014',
      },
    });

    expect(result).toEqual({
      foo: new Date(1_660_676_547_014),
    });
  });

  it('deserialises a date with multiple levels', () => {
    const result = recursivelyDeserialiseDate({
      foo: {
        bar: {
          $type: 'date',
          value: '1660676547014',
        },
      },
    });

    expect(result).toEqual({
      foo: {
        bar: new Date(1_660_676_547_014),
      },
    });
  });

  it('leaves other types of complex data untouched', () => {
    const recipes = JSON.parse(`
{"items":[{"hotOrCold":"Hot","shortName":"test","potentialExclusions":[{"name":"test","allergen":true,"id":"4f7030df-6b0a-40c5-8c66-729c17a19dc7"}],"allergens":"test","invalidExclusions":["4f7030df-6b0a-40c5-8c66-729c17a19dc7"],"foo":{"$type":"date","value":"1660676547014"},"description":"test","id":"09912018-6552-4d2f-b56d-31f2ebff0ab1","name":"test"},{"hotOrCold":"Cold","shortName":"test","alternates":[{"customisationId":"4f7030df-6b0a-40c5-8c66-729c17a19dc7","recipeId":"1288283c-c332-4ad0-a837-a476b7c21f48"}],"potentialExclusions":[],"allergens":"test","invalidExclusions":[],"description":"test","id":"1288283c-c332-4ad0-a837-a476b7c21f48","name":"test"}]}`);

    const result = recursivelyDeserialiseDate(recipes);

    expect(result).toEqual(recipes);
  });
});

describe('recursivelySerialiseDate', () => {
  it('returns an empty object given an empty object', () => {
    const result = recursivelySerialiseDate({});

    expect(result).toEqual({});
  });

  it('serialises a date on the first level', () => {
    const result = recursivelySerialiseDate({
      foo: new Date(1_660_676_547_014),
    });
    console.log(JSON.stringify(result));

    expect(result).toEqual({
      foo: {
        $type: 'date',
        value: '1660676547014',
      },
    });
  });

  it('leaves other types of complex data untouched', () => {
    const recipes = JSON.parse(`
{"items":[{"hotOrCold":"Hot","shortName":"test","potentialExclusions":[{"name":"test","allergen":true,"id":"4f7030df-6b0a-40c5-8c66-729c17a19dc7"}],"allergens":"test","invalidExclusions":["4f7030df-6b0a-40c5-8c66-729c17a19dc7"],"foo":{"$type":"date","value":"1660676547014"},"description":"test","id":"09912018-6552-4d2f-b56d-31f2ebff0ab1","name":"test"},{"hotOrCold":"Cold","shortName":"test","alternates":[{"customisationId":"4f7030df-6b0a-40c5-8c66-729c17a19dc7","recipeId":"1288283c-c332-4ad0-a837-a476b7c21f48"}],"potentialExclusions":[],"allergens":"test","invalidExclusions":[],"description":"test","id":"1288283c-c332-4ad0-a837-a476b7c21f48","name":"test"}]}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = recursivelySerialiseDate(recipes) as any;

    expect(result.items[0].foo['$type']).toEqual('date');
    expect(result.items[0].foo.value).toEqual('1660676547014');
  });

  it('leaves other types of complex data untouched', () => {
    const recipes = JSON.parse(`
{"items":[{"hotOrCold":"Hot","shortName":"test","potentialExclusions":[{"name":"test","allergen":true,"id":"4f7030df-6b0a-40c5-8c66-729c17a19dc7"}],"allergens":"test","invalidExclusions":["4f7030df-6b0a-40c5-8c66-729c17a19dc7"],"description":"test","id":"09912018-6552-4d2f-b56d-31f2ebff0ab1","name":"test"},{"hotOrCold":"Cold","shortName":"test","alternates":[{"customisationId":"4f7030df-6b0a-40c5-8c66-729c17a19dc7","recipeId":"1288283c-c332-4ad0-a837-a476b7c21f48"}],"potentialExclusions":[],"allergens":"test","invalidExclusions":[],"description":"test","id":"1288283c-c332-4ad0-a837-a476b7c21f48","name":"test"}]}`);

    const result = recursivelySerialiseDate(recipes);

    expect(result).toEqual(recipes);
  });

  it('serialises a date with multiple levels', () => {
    const result = recursivelySerialiseDate({
      foo: {
        bar: new Date(1_660_676_547_014),
      },
    });

    expect(result).toEqual({
      foo: {
        bar: {
          $type: 'date',
          value: '1660676547014',
        },
      },
    });
  });
});
