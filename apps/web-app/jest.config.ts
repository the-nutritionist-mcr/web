// eslint-disable-next-line import/no-anonymous-default-export
export default {
  displayName: 'web-app',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: [
    '<rootDir>/src/test-support/test-setup.ts',
    'jest-extended/all',
  ],
  moduleNameMapper: {
    '\\.(png\\?webp)$': '<rootDir>/file-mock.js',
  },
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web-app',
};
