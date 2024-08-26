export class ServerIsland extends HTMLElement {
  static tagName = 'server-island';

  static register() {
    customElements.define(this.tagName, this);
  }

  #html = '';

  async connectedCallback() {
    const src = this.getAttribute('src');

    if (!src) return;

    if (this.#html !== '') {
      const response = await fetch(src);

      if (response.status === 200 && response.headers.get('content-type') === 'text/html') {
        this.#html = await response.text();
      }
    }

    const frag = document.createRange().createContextualFragment(this.#html);
    this.textContent = ''; // Clear loading content
    this.appendChild(frag);
  }
}
