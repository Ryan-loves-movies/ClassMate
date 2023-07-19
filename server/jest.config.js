/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    modulePaths: ['<rootDir>'],
    transform: {
        '^.+\\.(ts|js)x?$': 'babel-jest',
        '^.+\\.(ts|js)x?$': ['ts-jest', { tsconfig: './tsconfig.json' }]
    },
    transformIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: ['<rootDir>/~'],
    // extensionsToTreatAsEsm: ['.ts', '.tsx', '.js', '.jsx'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: '<rootDir>/'
        })
    }
    // moduleNameMapper: {
    //     '^@components/(.*)$': '<rootDir>/src/components/$1'
    // }
};
