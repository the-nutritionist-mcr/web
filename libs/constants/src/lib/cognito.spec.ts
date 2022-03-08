import { COGNITO } from './cognito';

Object.values(COGNITO.customAttributes).forEach((attribute) => {
  test(`custom attribute key '${attribute}' should be less than 20 characters`, () => {
    expect(attribute.length).toBeLessThanOrEqual(20);
  });
});
