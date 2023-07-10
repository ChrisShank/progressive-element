import { html } from 'lit';

export interface Tab {
  id: string;
  label: string;
  closeable?: boolean;
  disabled?: boolean;
}

export interface TabsData {
  activeTab: string;
  tabs: Tab[];
}

export interface RenderOptions {
  isServerRendered?: boolean;
}

export function renderTabs(data: TabsData, options?: RenderOptions) {
  const content = html`<div slot="tabs">
    ${data.tabs.map(
      (tab) =>
        html`<div
          slot="tab"
          tab-id="${tab.id}"
          active="${tab.id === data.activeTab}"
          closable="${!!tab.closeable}"
          tabindex="0"
        >
          <span>${tab.label}</span>
          <button slot="tab-close-button">⨉</button>
        </div> `
    )}
  </div>`;

  if (options?.isServerRendered) {
    return html`<these-tabs active-tab="${data.activeTab}">${content}</these-tabs>`;
  }

  return content;
}
