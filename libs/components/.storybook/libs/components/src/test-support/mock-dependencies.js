import { when } from 'jest-when';
import { NavigationContext, } from '../organisms/login-and-register-box/navigation-context';
import { AuthenticationServiceContext, } from '../organisms/login-and-register-box/authentication-service-context';
import React from 'react';
export const mockDependencies = (dependencies) => {
    const useContext = jest.spyOn(React, 'useContext');
    const deps = Object.assign({ register: jest.fn(), login: jest.fn(), newPasswordChallengeResponse: jest.fn(), confirmSignup: jest.fn(), navigate: jest.fn() }, (dependencies !== null && dependencies !== void 0 ? dependencies : []));
    when(useContext)
        .calledWith(AuthenticationServiceContext)
        .mockReturnValue(deps);
    when(useContext)
        .calledWith(NavigationContext)
        .mockReturnValue(deps);
};
//# sourceMappingURL=mock-dependencies.js.map