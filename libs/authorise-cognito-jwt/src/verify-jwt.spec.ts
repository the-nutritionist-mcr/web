import { mocked } from 'jest-mock';
import { getIssuer } from './get-issuer';
import { validToken } from './test-tokens';
import { verifyJwtToken } from './verify-jwt';

describe('verify JWT', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env.COGNITO_POOL_ID = 'us-east-1_nfWupeuVh';
    process.env.AWS_REGION = 'us-east-1';
    jest.useFakeTimers().setSystemTime(new Date('2021-09-14').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws an error if the claim does not match the public keys', async () => {
    jest.doMock('./get-public-keys');

    const { getPublicKeys } = await import('./get-public-keys');

    mocked(getPublicKeys).mockResolvedValue({
      'l5X/+tD2qmhRilvQ3wEGP5acorOHndbc2EYLmLo59vA=': {
        pem: 'foo',
        instance: {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'l5X/+tD2qmhRilvQ3wEGP5acorOHndbc2EYLmLo52vA=',
          kty: 'RSA',
          n: 'sHFwfCrcYLatCMvsbj2yXiC1ElCbC1RaGQeAL2OgLT3qg8mO45v1DV6W-Uw3vQ5DO2j4AHz6D7y2yYOXf3GbTmnMURWC4HrBfxIwJoZmzysGao2WSvFaFlE2pdE_X3i5HlnD_LGn1Fw-qgiQ6rpvcRMzh8a3InrDIOWQLvDyb97gyz7Q4G5MPLhVCj0XR_qEA0zBZO9Psl8YRq9SuzHlPT0w_OTL92NLu8DCjsuG0ZZPOdArIr-xcswb3JzBUTTNZWRkqbNsZ8XjNpZiyl8zm7PzdMqSeIpZT-syLH36sAMvddaxVylh2JuXremafa7FfC62-xfiHv4b-aSJO-j60Q',
          use: 'sig',
        },
      },
      'PGFywWnh66ZziZorBQnaffatlWNZhtvns7L9zyxH/dg=': {
        pem: 'foo',
        instance: {
          alg: 'RS256',
          e: 'AQAB',
          kid: 'PGFywWnh66ZziZorBQnaffwtlWNZhtvns7L9zyxH/dg=',
          kty: 'RSA',
          n: '2xGuWUTFkFLl0uhJBR0CFLIJOWb_O4VNRLykuE2PkWA06JObwIzL1oDnLaUayCAAmUpMaOg3uKscX2sDtNQR1zG3GlP6xKlvb2gv5DsBC5Ny2XmGMdmjX9Itc3O_XSO44II0YB6vXbuwADkp0vOzzfD4OgTXRVCQ2I8rWhP0Lyx1E8EQxiRdP15P0Ol4rXLvhp5pB0dHy2NEQMG6StEMu69xATJG9GEe4Zj1IXo-ekk6ny_H18LPXrv1KjYXHT5vJ3NfjBP6FC_nYVuT1BpnM2WmczBKFraOYWtsVkFemSw1iFutg2DNknI6VigPrX4Rblbpbj860aeB_wrvbj8xAQ',
          use: 'sig',
        },
      },
    });

    const { verifyJwtToken: verifyJwtTokenWithMockedPublicKeys } = await import(
      './verify-jwt'
    );
    const result = await verifyJwtTokenWithMockedPublicKeys({
      token: validToken,
    });

    expect(result.isValid).toEqual(false);
    expect(result.error?.message).toEqual('claim made for unknown kid');
  });

  it("throws an error if the issuer doesn't match", async () => {
    jest.doMock('./verify');
    jest.dontMock('./get-public-keys');

    const { verify } = await import('./verify');

    mocked(verify).mockResolvedValue({
      tokenUse: 'id',
      authTime: Math.floor(new Date('2021-09-14').getTime() / 1000),
      iss: 'the-wrong-issuer',
      given_name: 'Ben',
      family_name: 'Wainwright',
      exp: Math.floor(new Date('2021-09-14').getTime() / 1000) + 1000,
      'cognito:groups': [],
      username: 'ben',
      clientId: 'bar',
    });

    const { verifyJwtToken: verifyWithMockedVerify } = await import(
      './verify-jwt'
    );
    const result = await verifyWithMockedVerify({ token: validToken });

    expect(result.isValid).toEqual(false);
    expect(result.error?.message).toEqual('claim issuer is invalid');
  });

  it('Returns groups as an empty array when the groups are not present in the claim', async () => {
    jest.doMock('./verify');
    jest.dontMock('./get-public-keys');

    const { verify } = await import('./verify');

    mocked(verify).mockResolvedValue({
      tokenUse: 'id',
      authTime: Math.floor(new Date('2021-09-14').getTime() / 1000),
      iss: getIssuer(),
      given_name: 'Ben',
      family_name: 'Wainwright',
      exp: Math.floor(new Date('2021-09-14').getTime() / 1000) + 1000,
      username: 'ben',
      clientId: 'bar',
    });

    const { verifyJwtToken: verifyWithMockedVerify } = await import(
      './verify-jwt'
    );
    const result = await verifyWithMockedVerify({ token: validToken });

    expect(result.groups).toEqual([]);
  });

  it('throws an error if the token is not an access token', async () => {
    jest.doMock('./verify');

    const { verify } = await import('./verify');

    mocked(verify).mockResolvedValue({
      tokenUse: 'something-else',
      authTime: Math.floor(new Date('2021-09-14').getTime() / 1000),
      iss: getIssuer(),
      given_name: 'Ben',
      family_name: 'Wainwright',
      exp: Math.floor(new Date('2021-09-14').getTime() / 1000) + 1000,
      'cognito:groups': [],
      username: 'ben',
      clientId: 'bar',
    });

    const { verifyJwtToken: verifyWithMockedVerify } = await import(
      './verify-jwt'
    );
    const result = await verifyWithMockedVerify({ token: validToken });

    expect(result.isValid).toEqual(false);
    expect(result.error?.message).toEqual('claim use is not access');
  });

  it.each`
    token
    ${''}
    ${'aaa'}
    ${'aaa.'}
    ${'aaa..'}
    ${'aaa.a.'}
    ${'ba2.a.'}
    ${'.a.a'}
    ${'some words'}
    ${'<!DOCTYPE html>'}
    ${'{ }'}
    ${'.a.a'}
  `(
    "fails verification when supplied with incorrectly formatted token '$token' with the error 'Token is invalid'",
    async ({ token }) => {
      const result = await verifyJwtToken(token);

      expect(result.isValid).toBeFalse();
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual('Token is invalid');
    }
  );

  it('fails verification if the user pool is not configured', async () => {
    delete process.env.COGNITO_POOL_ID;
    const result = await verifyJwtToken({ token: validToken });
    expect(result.isValid).toBeFalse();
    expect(result.error?.message).toEqual('COGNITO_POOL_ID not configured');
  });

  it("passes verification when passed a valid token that hasn't expired", async () => {
    jest.setSystemTime(new Date('2021-09-14T12:20:00'));
    const result = await verifyJwtToken({ token: validToken });
    expect(result.isValid).toBeTrue();
  });

  it("fails verification when passed a valid token that hasn't expired but the passed in group isn't included in the claim", async () => {
    jest.setSystemTime(new Date('2021-09-14T12:20:00'));
    const result = await verifyJwtToken({
      token: validToken,
      authorisedGroups: ['a-random-group'],
    });
    expect(result.isValid).toBeFalse();
  });

  it("passes verification when passed a valid token that hasn't expired and the passed in group is included in the claim", async () => {
    jest.setSystemTime(new Date('2021-09-14T12:20:00'));
    const result = await verifyJwtToken({
      token: validToken,
      authorisedGroups: ['admin'],
    });
    expect(result.isValid).toBeTrue();
  });

  it('fails verification when passed a valid token that has expired', async () => {
    jest.setSystemTime(new Date('2022-09-19T12:20:00'));
    const result = await verifyJwtToken({ token: validToken });
    expect(result.isValid).toBeFalse();
    expect(result.error?.message).toEqual('jwt expired');
  });
});
