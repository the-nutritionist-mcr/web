module.exports = {
  displayName: 'components',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: [
    '<rootDir>/src/test-support/test-setup.ts',
    'jest-extended/all',
  ],
  transform: {
    '^.+\\.(svg|css|png)$': 'jest-transform-stub',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/components',
};
