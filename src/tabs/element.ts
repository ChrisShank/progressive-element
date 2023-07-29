import { render } from 'lit';
import { renderTabs, Tab } from './template';

export class TheseTabs extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', this);
  }

  #tabs: Tab[] | null = null;
  get tabs(): Tab[] {
    if (this.#tabs === null) {
      const tabEls = this.querySelectorAll('[slot="tab"]');
      this.#tabs = Array.from(tabEls).map((tab) => ({
        id: tab.getAttribute('tab-id') || '',
        label: tab.querySelector('span')?.innerText ?? '',
        closeable: tab.getAttribute('closable') === 'true',
      }));
    }
    return this.#tabs;
  }

  set tabs(tabs: Tab[]) {
    this.#tabs = tabs;
    this.render();
  }

  get activeTab() {
    return this.getAttribute('active-tab') || '';
  }

  set activeTab(value: string) {
    this.setAttribute('active-tab', value);
  }

  handleEvent(e: Event) {
    if (e.target === null || !(e.target instanceof HTMLElement)) return;

    if (e.type === 'click') {
      const tabEl = e.target.closest('[slot="tab"]');
      const closeButtonEl = e.target.closest('button[slot="tab-close-button"]');
      if (closeButtonEl !== null && tabEl !== null) {
        const tabId = tabEl.getAttribute('tab-id');
        this.#tabs = this.tabs.filter((tab) => tab.id !== tabId);
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
  }

  hasRendered = false;

  render() {
    // If we haven't rendered yet then clear the server rendered DOM
    if (!this.hasRendered) {
      this.replaceChildren();
      this.hasRendered = true;
    }
    render(renderTabs({ tabs: this.#tabs || [], activeTab: this.activeTab }), this);
  }
}

customElements.define('these-tabs', TheseTabs);

declare global {
  interface HTMLElementTagNameMap {
    'these-tabs': TheseTabs;
  }
}
