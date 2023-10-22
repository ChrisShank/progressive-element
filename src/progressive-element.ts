interface Intention {
  intention: string;
  target: Element;
}

export interface AnyEvent {
  type: string;
  [key: string]: any;
}

export function findClosestIntention(
  event: AnyEvent,
  prefix = 'on\\:'
): Intention | Record<string, never> {
  if (event.target instanceof Element) {
    const target = event.target.closest(`[${prefix}${event.type}]`);

    if (target !== null) {
      const intention = target.getAttribute(`on:${event.type}`)!;
      return { intention, target };
    }
  }

  return {};
}

export class PropertyChangeEvent {
  readonly type = 'property-change';

  constructor(
    readonly name: string,
    readonly oldValue: string | null,
    readonly newValue: string | null
  ) {}
}

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

export class ProgressiveElement extends HTMLElement implements EventListenerObject {
  static register() {
    customElements.define(kebabize(this.name), this);
  }

  static properties?: Record<string, any>;

  static get observedAttributes() {
    if (this.properties === undefined) {
      return undefined;
    }

    return Object.keys(this.properties);
  }

  static delegatedEvents?: AnyEventType[];

  constructor() {
    super();

    // TODO initialize properties for properties
    const constructor = this.constructor as typeof ProgressiveElement;

    constructor.delegatedEvents?.forEach((event) => this.addEventListener(event, this));
  }

  // TODO: parse attributes into properties
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    this.handleEvent(new PropertyChangeEvent(name, oldValue, newValue));
  }

  // @ts-ignore
  handleEvent(event: AnyEvent): void {}
}
