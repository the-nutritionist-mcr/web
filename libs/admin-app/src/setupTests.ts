// Jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import 'jest-enzyme';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const noop = () => {
  // NOOP
};

// eslint-disable-next-line fp/no-mutating-methods
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
