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
  modifier?: (event: AnyEvent) => string,
  prefix = 'on:'
): Intention | Record<string, never> {
  if (event.target instanceof Element) {
    const attributeName = `${prefix}${event.type}${modifier?.(event) ?? ''}`;
    const target = event.target.closest(`[${CSS.escape(attributeName)}]`);
    if (target !== null) {
      const intention = target.getAttribute(attributeName)!;
      return { intention, target };
    }
  }

  return {};
}

const systemKeys = ['alt', 'ctrl', 'meta', 'shift'];

export function keyboardModifiers(event: AnyEvent) {
  if (event instanceof KeyboardEvent) {
    const systemModifiers = systemKeys
      .filter((key) => event[`${key}Key` as keyof KeyboardEvent])
      .join('.');
    return `${systemModifiers.length > 0 ? '.' : ''}${systemModifiers}.${event.code.toLowerCase()}`;
  }
  return '';
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

    const constructor = this.constructor as typeof ProgressiveElement;

    constructor.delegatedEvents?.forEach((event) => this.addEventListener(event, this));
  }

  // TODO: parse attributes into properties?
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    this.handleEvent(new PropertyChangeEvent(name, oldValue, newValue));
  }

  handleEvent(_event: AnyEvent): void {}
}
