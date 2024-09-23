import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';

const examplesDir = resolve(__dirname, 'examples');

export default defineConfig({
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: readdirSync(examplesDir)
        .filter((file) => file.endsWith('.html'))
        .reduce((acc, file) => {
          acc[file.replace('.html', '')] = resolve(examplesDir, file);
          return acc;
        }, {} as Record<string, string>),
    },
  },
});
