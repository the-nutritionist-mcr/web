import { Auth } from '@aws-amplify/auth';
import { when } from 'jest-when';
import * as authenticate from './authenticate';
import { mock } from 'jest-mock-extended';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import { getAppConfig } from '@tnmw/utils';

jest.mock('@aws-amplify/auth');
jest.mock('aws-sdk');
jest.mock('@tnmw/utils');

describe('The authenticate module', () => {
  describe('register()', () => {
    it('returns the promise from Auth.signUp', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        ApiDomainName: 'locahost',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      const mockResult = mock<ISignUpResult>();

      when(jest.mocked(Auth.signUp))
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
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        UserPoolId: 'pool-id',
        ApiDomainName: 'locahost',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      const response = {
        signInUserSession: {},
        challengeName: 'foo',
      };

      when(jest.mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(response);

      const result = await authenticate.login('foo', 'bar');

      expect(result.success).toBeFalsy();
      expect(result.challengeName).toEqual('foo');
    });

    it('returns the appropriate response if the login is successful', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      const response = {
        signInUserSession: {
          accessToken: 'foo-token',
          idToken: {
            payload: {
              given_name: 'ben',
              family_name: 'wainwright',
              email: 'a@b.c',
            },
          },
        },
      };

      when(jest.mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(response);

      const result = await authenticate.login('foo', 'bar');

      expect(result.success).toBeTruthy();
    });

    it('doesnt change the type of the object returned from the login method', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      class FakeCognitoResponse {
        signInUserSession = {
          accessToken: 'foo-token',
          idToken: {
            payload: {
              given_name: 'ben',
              family_name: 'wainwright',
              email: 'a@b.c',
            },
          },
        };
      }

      when(jest.mocked(Auth.signIn))
        .calledWith('foo', 'bar')
        .mockResolvedValue(new FakeCognitoResponse());

      const result = await authenticate.login('foo', 'bar');

      expect(result).toBeInstanceOf(FakeCognitoResponse);
    });
  });

  describe('signOut()', () => {
    it('returns the promise from Auth.logout', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      jest.mocked(Auth.signOut).mockResolvedValue('logoutResponse');

      const result = await authenticate.signOut();

      expect(result).toEqual('logoutResponse');
    });
  });

  describe('newPasswordChallengeResponse', () => {
    it('returns the appropriate response on failure', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      const usernameValue = 'the-username';
      const passwordValue = 'the-password';

      const response = {
        signInUserSession: {},
        challengeName: 'foo',
      };

      jest.mocked(Auth.completeNewPassword).mockResolvedValue(response);

      const result = await authenticate.newPasswordChallengeResponse(
        usernameValue,
        passwordValue
      );

      expect(result.success).toBeFalsy();
      expect(result.challengeName).toEqual('foo');
    });

    it('returns the appropriate response on success', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      const usernameValue = 'the-username';
      const passwordValue = 'the-password';

      const response = {
        signInUserSession: {
          accessToken: 'foo-token',
        },
      };

      jest.mocked(Auth.completeNewPassword).mockResolvedValue(response);

      const result = await authenticate.newPasswordChallengeResponse(
        usernameValue,
        passwordValue
      );

      expect(result.success).toBeTruthy();
    });
  });

  describe('Confirmsignup', () => {
    it('Returns the promise from Auth.confirmSignup', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      when(jest.mocked(Auth.confirmSignUp))
        .calledWith('foo', 'bar')
        .mockResolvedValue('confirmResponse');

      const result = await authenticate.confirmSignup('foo', 'bar');

      expect(result).toEqual('confirmResponse');
    });
  });

  describe('currentUser()', () => {
    it('returns the promise from Auth.currentAuthenticatedUser', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      jest
        .mocked(Auth.currentAuthenticatedUser)
        .mockResolvedValue('currentUserResponse');

      const result = await authenticate.currentUser();

      expect(result).toEqual('currentUserResponse');
    });

    it('returns undefined if currentAuthenticatedUser throws', async () => {
      jest.mocked(getAppConfig).mockResolvedValue({
        DomainName: 'foo',
        ApiDomainName: 'locahost',
        UserPoolId: 'pool-id',
        ClientId: 'client-id',
        Environment: 'prod',
        AwsRegion: 'eu-west-1',
        ChargebeeUrl: 'localhost',
      });

      jest
        .mocked(Auth.currentAuthenticatedUser)
        .mockRejectedValue(new Error('Whoops!'));

      const result = await authenticate.currentUser();

      expect(result).toBeUndefined();
    });
  });
});
