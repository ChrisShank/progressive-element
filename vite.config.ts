import { defineConfig, Plugin } from 'vite';
import { renderToString } from './src/render-to-string';
import { renderTabs } from './src/tabs/template';

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        'RENDER_TABS',
        renderToString(
          renderTabs(
            {
              tabs: [
                { id: 'foo', label: 'Foo' },
                { id: 'bar', label: 'Bar' },
              ],
              activeTab: 'foo',
            },
            { isServerRendered: true }
          )
        )
      );
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
