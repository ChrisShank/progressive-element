import { render } from 'lit';
import { renderTabs, Tab } from './template';

export class TheseTabs extends HTMLElement {
  _tabs: Tab[] = [];

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);

    const tabEls = this.querySelectorAll('[slot="tab"]');
    this._tabs = Array.from(tabEls).map((tab) => ({
      id: tab.getAttribute('tab-id') || '',
      label: tab.querySelector('span')?.innerText ?? '',
      closeable: tab.getAttribute('closable') === 'true',
    }));
  }
  connectedCallback() {
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
  }

  get tabs(): Tab[] {
    return this._tabs;
  }

  set tabs(tabs: Tab[]) {
    this._tabs = tabs;
    this.render();
  }

  get activeTab(): string {
    return this.getAttribute('active-tab') || '';
  }

  onClick(e: MouseEvent) {
    if (e.target === null || !(e.target instanceof HTMLElement)) return;

    const tabEl = e.target.closest('[slot="tab"]');
    const closeButtonEl = e.target.closest('button[slot="tab-close-button"]');
    if (closeButtonEl !== null && tabEl !== null) {
      const tabId = tabEl.getAttribute('tab-id');
      this.tabs = this.tabs.filter((tab) => tab.id !== tabId);
    } else if (tabEl !== null) {
      const tabId = tabEl.getAttribute('tab-id');
      if (tabId === null) return;

      const activeTab = this.querySelector('[slot="tab"][active="true"]');
      if (activeTab === null) return;

      activeTab.setAttribute('active', 'false');
      tabEl.setAttribute('active', 'true');
      this.setAttribute('active-tab', tabId);
    }
  }

  hasRendered = false;

  render() {
    // If we haven't rendered yet then clear the server rendered DOM
    if (!this.hasRendered) {
      this.replaceChildren();
      this.hasRendered = true;
    }
    render(renderTabs({ tabs: this._tabs, activeTab: this.activeTab }), this);
  }
}

customElements.define('these-tabs', TheseTabs);

declare global {
  interface HTMLElementTagNameMap {
    'these-tabs': TheseTabs;
  }
}
