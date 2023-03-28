import { when } from 'jest-when';
import {
  AuthenticationServiceContext,
  AuthenticationContextType,
} from '../organisms/login-and-register-box/authentication-service-context';

import React from 'react';
import { NavigationContext, NavigationContextType } from '@tnmw/utils';

export const mockDependencies = (
  dependencies?: AuthenticationContextType & NavigationContextType
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useContext = jest.spyOn(React, 'useContext') as any;
  const deps = {
    register: jest.fn(),
    login: jest.fn(),
    newPasswordChallengeResponse: jest.fn(),
    confirmSignup: jest.fn(),
    navigate: jest.fn(),
    ...(dependencies ?? []),
  };

  when<AuthenticationContextType, [typeof AuthenticationServiceContext]>(
    useContext
  )
    .calledWith(AuthenticationServiceContext)
    .mockReturnValue(deps);

  when<NavigationContextType, [typeof NavigationContext]>(useContext)
    .calledWith(NavigationContext)
    .mockReturnValue(deps);
};
