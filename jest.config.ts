/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/app/src'],
  testMatch: ['**/__tests__/**/*.tsx', '**/*.test.tsx', '**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverageFrom: [
    'app/src/**/*.{ts,tsx}',
    '!app/src/**/*.d.ts',
    '!app/src/main.tsx',
    '!app/src/vite-env.d.ts',
  ],
};
