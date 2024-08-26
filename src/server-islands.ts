// Also see https://www.npmjs.com/package/html-include-element

export class ServerIsland extends HTMLElement {
  #internals = this.attachInternals();

  async connectedCallback() {
    const src = this.getAttribute('src');

    if (!src) return;

    const response = await fetch(src);

    if (response.status === 200 && response.headers.get('content-type') === 'text/html') {
      const html = await response.text();
      const frag = document.createRange().createContextualFragment(html);
      this.textContent = ''; // Clear loading content
      this.appendChild(frag);
      this.#internals.states.add('loaded');
    }
  }
}

customElements.define('server-island', ServerIsland);
