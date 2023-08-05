// import './tabs/element.ts'

interface ProgressiveElement {
  handleEvent(event: Event): void | Promise<void>;
}

interface Intention {
  intention: string;
  target: HTMLElement;
}

function findClosestIntention(event: Event): Intention | Record<string, never> {
  if (event.target instanceof Element) {
    const target = event.target.closest(`[on\\:${event.type}]`) as HTMLElement | null;

    if (target !== null) {
      const intention = target.getAttribute(`on:${event.type}`)!;
      return { intention, target };
    }
  }
  return {};
}

interface AttributeChangeEventDetail {
  name: string;
  oldValue: string | null;
  newValue: string | null;
}

class AttributeChangeEvent extends CustomEvent<AttributeChangeEventDetail> {
  constructor(name: string, oldValue: string | null, newValue: string | null) {
    super('attribute-change', { detail: { name, oldValue, newValue } });
  }
}

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

class ProgressiveElement extends HTMLElement implements EventListenerObject {
  static observedAttributes?: string[];
  static observedEvents?: AnyEventType[];

  constructor() {
    super();

    const observedEvents = (this.constructor as typeof ProgressiveElement).observedEvents ?? [];
    for (const event of observedEvents) {
      this.addEventListener(event, this);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    this.handleEvent(new AttributeChangeEvent(name, oldValue, newValue));
  }

  handleEvent(_event: Event): void {}
}

class MyElement extends ProgressiveElement {
  static observedEvents = ['click'];
  static observedAttributes = ['foo'];

  count: HTMLElement = this.querySelector('#count')!;

  handleEvent(event: Event) {
    const { intention } = findClosestIntention(event);

    if (intention === undefined) return;

    event.stopPropagation(); // Stop event propagation of all events that have an intention

    switch (intention) {
      case 'INCREMENT': {
        this.count.innerText = (Number(this.count.innerText) + 1).toString();
        break;
      }
      case 'DECREMENT': {
        this.count.innerText = (Number(this.count.innerText) - 1).toString();
        break;
      }
    }
  }
}

customElements.define('my-element', MyElement);
