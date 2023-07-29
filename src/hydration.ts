type CustomElementImports = Record<string, () => Promise<any>>;

// Assume that JS module is deferred so that the DOM is loaded.
// Using DOMContentLoaded is blocked by executing all of the scripts

function hydrateOnIdle(customElementImports: CustomElementImports) {
  const tagsToLoad = new Set<string>();
  document.querySelectorAll('[hydrate\\:idle]').forEach((el) => {
    const { localName } = el;
    if (localName.includes('-') && customElements.get(localName) === undefined) {
      tagsToLoad.add(localName);
    }
  });

  requestIdleCallback(() => {
    tagsToLoad.forEach((tag) => {
      customElementImports[tag]?.();
    });
  });
}

function hydrateOnVisible(customElementImports: CustomElementImports) {
  const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        customElementImports[entry.target.localName]?.();

        observer.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('[hydrate\\:visible]').forEach((el) => {
    const { localName } = el;
    if (localName.includes('-') && customElements.get(localName) === undefined) {
      intersectionObserver.observe(el);
    }
  });
}

function hydrateOnInteraction(customElementImports: CustomElementImports) {
  const numberOfCustomElementsToImport = Object.keys(customElementImports).length;
  const tagsLoaded = new Set<string>();

  const listener = async (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return;

    const ce = e.target.hasAttribute('hydrate//:interaction')
      ? e.target
      : e.target.closest('[hydrate\\:interaction]');

    if (ce === null) return;

    if (!(ce.localName in customElementImports)) {
      return;
    }

    await customElementImports[ce.localName]();

    tagsLoaded.add(e.target.localName);

    if ('handleEvent' in e.target && typeof e.target.handleEvent === 'function') {
      e.target.handleEvent(e);
    }

    if (tagsLoaded.size === numberOfCustomElementsToImport) {
      document.removeEventListener('click', listener);
    }
  };

  document.addEventListener('click', listener, { capture: true });
}
