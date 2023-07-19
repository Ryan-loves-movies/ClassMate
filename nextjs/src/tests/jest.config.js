/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('../../tsconfig.test.json')
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePaths: ["<rootDir>"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(ts|js)x?$": "ts-jest",
  },
  transformIgnorePatterns: ['/node_modules/'],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.js', '.jsx'],
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.tsx', '.js', '.jsx'],
    'ts-jest': {
      babelConfig: {
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        useESM: true,
      },
    },
  },
  // moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/"}),
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1'
  }
};