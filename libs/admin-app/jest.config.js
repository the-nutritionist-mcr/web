const es6Packages = [
  "grommet-controls",
  "react-markdown",
  "bail",
  "is-plain-obj",
  "trough",
  "decode-named-character-reference",
  "character-entities",
  "vfile",
  "unified",
  "remark-rehype",
  "remark-parse",
  "mdast-util-from-markdown",
  "unist-util-stringify-position",
  "unist-builder",
  "mdast-util-to-hast",
  "mdast-util-to-string",
  "micromark",
  "micromark-core-commonmark",
  "parse-entities"
]

module.exports = {
  displayName: 'admin-app',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    '^.+\\.[t]sx?$': 'ts-jest',
    '^.+\.js$': 'babel-jest'
  },
  // transformIgnorePatterns: [
  //   `/node_modules/(?!${es6Packages.join('|')})`,
  // ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/admin-app',
};
