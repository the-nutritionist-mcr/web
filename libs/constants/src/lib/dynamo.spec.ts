import { DYNAMO } from './dynamo';

Object.values(DYNAMO.customAttributes).forEach((attribute) => {
  test(`custom attribute key '${attribute}' should be less than 20 characters`, () => {
    expect(attribute.length).toBeLessThanOrEqual(20);
  });
});
