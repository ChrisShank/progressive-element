import { render } from 'lit';
import { renderTabs, Tab } from './template';

export class TheseTabs extends HTMLElement {
  hasRendered = false;

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }
  connectedCallback() {
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
  }

  get tabs(): Tab[] {
    const tabEls = this.querySelectorAll('[slot="tab"]');
    return Array.from(tabEls).map((tab) => ({
      id: tab.getAttribute('tab-id') || '',
      label: (tab as HTMLElement).innerText,
    }));
  }

  set tabs(tabs: Tab[]) {
    if (!this.hasRendered) {
      this.replaceChildren();
      this.hasRendered = true;
    }
    render(renderTabs({ tabs, activeTab: this.activeTab }), this);
  }

  get activeTab(): string {
    return this.getAttribute('active-tab') || '';
  }

  onClick(e: MouseEvent) {
    if (e.target === null || !(e.target instanceof HTMLElement)) return;

    const tabEl = e.target.closest('[slot="tab"]');
    if (tabEl === null) return;

    const tabId = tabEl.getAttribute('tab-id');
    if (tabId === null) return;

    const activeTab = this.querySelector('[slot="tab"][active="true"]');
    if (activeTab === null) return;

    activeTab.setAttribute('active', 'false');
    tabEl.setAttribute('active', 'true');
    this.setAttribute('active-tab', tabId);
  }
}

customElements.define('these-tabs', TheseTabs);

declare global {
  interface HTMLElementTagNameMap {
    'these-tabs': TheseTabs;
  }
}
