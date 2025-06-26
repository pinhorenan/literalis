// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './vitest.setup.ts',
    include: [
      'tests/services/*.test.ts',
      'tests/controllers/*.test.ts',
      'tests/repositories/*.test.ts',
    ],
    exclude: ['node_modules', 'dist', 'tests/e2e/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      all: true,
      include: ['src/services/*.ts'],
      exclude: ['**/*.d.ts', '**/__mocks__/**'],
    },
  },
});
