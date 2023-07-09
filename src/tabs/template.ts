import { html } from 'lit';

export interface Tab {
  id: string;
  label: string;
}

export interface TabData {
  activeTab: string;
  tabs: Tab[];
}

export interface RenderOptions {
  isServerRendered?: boolean;
}

export function renderTabs(data: TabData, options?: RenderOptions) {
  const content = html`<div slot="tabs">
    ${data.tabs.map(
      (tab) =>
        html`<div slot="tab" tab-id="${tab.id}" active="${
          tab.id === data.activeTab
        }" tabindex="0">${tab.label}</div>`
    )}
  </div>`;

  if (options?.isServerRendered) {
    return html`<these-tabs active-tab="${data.activeTab}">${content}</these-tabs>`;
  }

  return content;
}
