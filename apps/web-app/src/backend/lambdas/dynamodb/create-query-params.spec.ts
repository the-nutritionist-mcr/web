import { createQueryParams } from './create-query-params';

describe('creat query params', () => {
  it('creates the correct set of query params when not using a reserved word', () => {
    const results = createQueryParams(`id = :id`, '2');
    expect(results.KeyConditionExpression).toEqual(`id = :id`);
    expect(results.ExpressionAttributeNames).toBeUndefined();
    expect(results.ExpressionAttributeValues).toEqual({
      ':id': '2',
    });
  });

  it('correctly substitutes reserved words', () => {
    const results = createQueryParams(`wait = :wait`, '100');
    expect(results.KeyConditionExpression).toEqual(`#wait = :wait`);
    expect(results.ExpressionAttributeNames).toEqual({
      '#wait': 'wait',
    });
    expect(results.ExpressionAttributeValues).toEqual({
      ':wait': '100',
    });
  });
});
