import { verifyJwt } from './verify-jwt';

describe('verifyJwt', () => {
  it('should work', () => {
    expect(verifyJwt()).toEqual('verify-jwt');
  });
});
