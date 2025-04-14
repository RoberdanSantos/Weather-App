export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  modulePaths: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^auth/(.*)$': '<rootDir>/src/auth/$1',
    '^user/(.*)$': '<rootDir>/src/user/$1',
    '^prisma/(.*)$': '<rootDir>/src/prisma/$1',
  },  
  collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
};
