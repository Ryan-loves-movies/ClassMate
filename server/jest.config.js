/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    modulePaths: ['<rootDir>'],
    transform: {
        '^.+\\.(ts|js)?$': 'babel-jest',
        '^.+\\.(ts|js)?$': ['ts-jest', { tsconfig: './tsconfig.json' }]
    },
    transformIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: ['<rootDir>/~'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: '<rootDir>/'
        })
    },
    globalTeardown: "<rootDir>/tests/teardownJest.ts"
};
