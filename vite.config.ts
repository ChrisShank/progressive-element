import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    modulePreload: false,
    target: 'esnext',
  },
});
