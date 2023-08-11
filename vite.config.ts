import { defineConfig, Plugin } from 'vite';

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return;
    },
  };
};

export default defineConfig({
  plugins: [htmlPlugin()],
  build: {
    modulePreload: false,
    target: 'esnext',
  },
});
