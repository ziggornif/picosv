import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'node:fs';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'picosv',
      // the proper extensions will be added
      fileName: 'picosv',
    },
  },
  plugins: [dts({
    afterBuild: () => {
      // Ensure the
      // package is supported by all consumers, we must export types that are
      // read as ESM. To do this, there must be duplicate types with the
      // correct extension supplied in the package.json exports field.
      copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
    },
    include: ['src'],
  })],
  server: {
    open: true,
  },
  test: {
    reporters: ['default', 'junit'],
    outputFile: './coverage/junit.xml',
    coverage: {
      include: ['src/**/*.{js,ts}'],
      exclude: ['**/**.spec.{js,ts}', 'src/examples/'],
      reportsDirectory: 'coverage',
      reporter: ['lcov', 'text', 'cobertura'],
    },
  },
});
