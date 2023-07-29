// import './tabs/element.ts'

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

function Listener(type: AnyEventType, selectors: string) {
  return (target: ProgressiveElement, methodName: string) => {
    const c = target.constructor as typeof ProgressiveElement;
    if (c.delegatedEvents.get(type) === undefined) {
      c.delegatedEvents.set(type, []);
    }

    c.delegatedEvents.get(type)?.push({ methodName, selectors });
  };
}

interface DelegatedEventListenerConfig {
  methodName: string;
  selectors: string;
}

type DelegatedEventListenersMap = Map<AnyEventType, DelegatedEventListenerConfig[]>;

type DelegatedEventListener = (event: Event, el: Element) => void;

class ProgressiveElement extends HTMLElement {
  static delegatedEvents: DelegatedEventListenersMap = new Map();

  static properties = new Map<string, any>();

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    const c = this.constructor as typeof ProgressiveElement;
    for (const event of c.delegatedEvents.keys()) {
      this.addEventListener(event, this);
    }
  }

  handleEvent(event: Event) {
    const c = this.constructor as typeof ProgressiveElement;
    const listeners = c.delegatedEvents.get(event.type);

    if (listeners === undefined || event.target === null || !(event.target instanceof Element)) {
      // TODO: throw error about `delegatedEvents` being modified
      return;
    }

    for (const { selectors, methodName } of listeners) {
      const selectedElement = event.target.closest(selectors);
      if (selectedElement !== null) {
        const method = this[methodName as keyof ProgressiveElement] as DelegatedEventListener;

        if (typeof method !== 'function') {
          // TODO: throw error about method not being a function
          return;
        }

        method.call(this, event, selectedElement);
      }
    }
  }
}

class MyElement extends ProgressiveElement {
  @Listener('click', 'button, [role="button"]')
  onButtonClick(_event: Event, element: HTMLElement) {
    element.innerText = (Number(element.innerText) + 1).toString();
  }
}

customElements.define('my-element', MyElement);
