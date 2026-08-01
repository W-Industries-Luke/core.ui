/**
 * Jest via jest-preset-angular (zoneless setup in setup-jest.ts).
 * 100% coverage enforced across the library's source.
 */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/projects/ui/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  testMatch: ['<rootDir>/projects/**/*.spec.ts'],
  collectCoverageFrom: [
    'projects/ui/src/lib/**/*.ts',
    '!projects/ui/src/lib/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { statements: 100, branches: 100, functions: 100, lines: 100 },
  },
};
