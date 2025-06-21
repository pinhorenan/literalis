import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@dto/(.*)$': '<rootDir>/src/types/dto/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@api/(.*)$': '<rootDir>/src/app/api/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@public/(.*)$': '<rootDir>/public/$1',
    '^@avatars/(.*)$': '<rootDir>/public/avatars/$1',
    '^@covers/(.*)$': '<rootDir>/public/bookcovers/$1',
    '^@images/(.*)$': '<rootDir>/public/images/$1',
    '^@fonts/(.*)$': '<rootDir>/public/fonts/$1',
    '^@icons/(.*)$': '<rootDir>/public/icons/$1',
    '^@assets/(.*)$': '<rootDir>/public/assets/$1',
    '^@upload/(.*)$': '<rootDir>/public/upload/$1',
  },
};

export default config;
