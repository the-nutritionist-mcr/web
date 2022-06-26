/* eslint-disable */
export default {
  displayName: 'connect-gmail-to-cypress',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/connect-gmail-to-cypress',
};
