import { defineConfig, Plugin } from 'vite';
import { renderToString } from './src/render-to-string';
import { renderTabs } from './src/tabs/template';

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      const tabs = renderToString(
        renderTabs(
          {
            tabs: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar', closeable: true },
              { id: 'baz', label: 'Baz', closeable: true },
              { id: 'fooBar', label: 'FooBar', closeable: true },
            ],
            activeTab: 'foo',
          },
          { isServerRendered: true }
        )
      );
      return html.replace('RENDER_TABS', tabs);
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
