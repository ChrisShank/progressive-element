import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import { defineConfig } from 'vite';

const examplesDir = resolve(__dirname, 'examples');
const input = {
  index: resolve(__dirname, 'index.html'),
};

for (const fileName of readdirSync(examplesDir)) {
  input[fileName.replace('.html', '')] = resolve(examplesDir, fileName);
}

export default defineConfig({
  build: {
    target: 'es2022',
    modulePreload: false,
    rollupOptions: { input },
  },
});
