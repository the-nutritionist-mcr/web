import { Auth } from '@aws-amplify/auth';
import { when } from 'jest-when';
import { mocked } from 'ts-jest/utils';
import { getPoolConfig } from './get-pool-config';
import * as authenticate from './authenticate';
import { mock } from 'jest-mock-extended';
import { ISignUpResult } from 'amazon-cognito-identity-js';

jest.mock('@aws-amplify/auth');
jest.mock('aws-sdk');
jest.mock('./get-pool-config');

describe('The authenticate module', () => {
  describe('register()', () => {
    it('returns the promise from Auth.signUp', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      const mockResult = mock<ISignUpResult>();

      when(mocked(Auth.signUp))
        .calledWith({
          username: 'foo-username',
          password: 'foo-password',
          attributes: {
            email: 'foo-email',
            given_name: 'foo-firstname',
            family_name: 'foo-surname',
            address: 'foo-address',
            phone_number: 'foo-telephone',
          },
        })
        .mockResolvedValue(mockResult);

      const result = await authenticate.register(
        'foo-username',
        'foo-password',
        'foo-salutation',
        'foo-email',
        'foo-firstname',
        'foo-surname',
        'foo-address',
        'foo-telephone'
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('login()', () => {
    it('returns the appropriate response on failure', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      const response = {
        signInUserSession: {},
        challengeName: 'foo',
      };

      when(mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(response);

      const result = await authenticate.login('foo', 'bar');

      expect(result.success).toBeFalsy();
      expect(result.challengeName).toEqual('foo');
    });

    it('returns the appropriate response if the login is successful', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      const response = {
        signInUserSession: {
          accessToken: 'foo-token',
        },
      };

      when(mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(response);

      const result = await authenticate.login('foo', 'bar');

      expect(result.success).toBeTruthy();
    });

    it('doesnt change the type of the object returned from the login method', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      class FakeCognitoResponse {
        signInUserSession = {
          accessToken: 'foo-token',
        };
      }

      when(mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(new FakeCognitoResponse());

      const result = await authenticate.login('foo', 'bar');

      expect(result).toBeInstanceOf(FakeCognitoResponse);
    });
  });

  describe('signOut()', () => {
    it('returns the promise from Auth.logout', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      mocked(Auth.signOut).mockResolvedValue('logoutResponse');

      const result = await authenticate.signOut();

      expect(result).toEqual('logoutResponse');
    });
  });

  describe('newPasswordChallengeResponse', () => {
    it('returns the appropriate response on failure', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      const usernameValue = 'the-username';
      const passwordValue = 'the-password';

      const response = {
        signInUserSession: {},
        challengeName: 'foo',
      };

      mocked(Auth.completeNewPassword).mockResolvedValue(response);

      const result = await authenticate.newPasswordChallengeResponse(
        usernameValue,
        passwordValue
      );

      expect(result.success).toBeFalsy();
      expect(result.challengeName).toEqual('foo');
    });

    it('returns the appropriate response on success', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      const usernameValue = 'the-username';
      const passwordValue = 'the-password';

      const response = {
        signInUserSession: {
          accessToken: 'foo-token',
        },
      };

      mocked(Auth.completeNewPassword).mockResolvedValue(response);

      const result = await authenticate.newPasswordChallengeResponse(
        usernameValue,
        passwordValue
      );

      expect(result.success).toBeTruthy();
    });
  });

  describe('Confirmsignup', () => {
    it('Returns the promise from Auth.confirmSignup', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      when(mocked(Auth.confirmSignUp))
        .calledWith('foo', 'bar')
        .mockResolvedValue('confirmResponse');

      const result = await authenticate.confirmSignup('foo', 'bar');

      expect(result).toEqual('confirmResponse');
    });
  });

  describe('currentUser()', () => {
    it('returns the promise from Auth.currentAuthenticatedUser', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      mocked(Auth.currentAuthenticatedUser).mockResolvedValue(
        'currentUserResponse'
      );

      const result = await authenticate.currentUser();

      expect(result).toEqual('currentUserResponse');
    });

    it('returns undefined if currentAuthenticatedUser throws', async () => {
      mocked(getPoolConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        RedirectUrl: 'redirect-url',
        AuthUrl: 'auth-url',
      });

      mocked(Auth.currentAuthenticatedUser).mockRejectedValue(
        new Error('Whoops!')
      );

      const result = await authenticate.currentUser();

      expect(result).toBeUndefined();
    });
  });
});
