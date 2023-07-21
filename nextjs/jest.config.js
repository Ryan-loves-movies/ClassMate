/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.test.json');
module.exports = {
    preset: 'ts-jest/presets/js-with-ts-esm',
    testEnvironment: 'jsdom',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleDirectories: ['node_modules', '<rootDir>'],
    modulePaths: ['<rootDir>'],
    transform: {
        '^.+\\.(ts|js)x?$': 'babel-jest',
        '^.+\\.(ts|js)x?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }]
    },
    transformIgnorePatterns: ['/node_modules/'],
    modulePathIgnorePatterns: ['<rootDir>/~'],
    // extensionsToTreatAsEsm: ['.ts', '.tsx', '.js', '.jsx'],
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: '<rootDir>/'
        })
    }
    // moduleNameMapper: {
    //     '^@components/(.*)$': '<rootDir>/src/components/$1'
    // }
};
