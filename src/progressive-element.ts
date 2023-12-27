interface Intention {
  intention: string;
  target: Element;
}

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

export interface AnyEvent {
  type: AnyEventType;
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

function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

export class ProgressiveElement extends HTMLElement implements EventListenerObject {
  static register() {
    customElements.define(kebabize(this.name), this);
  }

  static delegatedEvents?: AnyEventType[];

  constructor() {
    super();

    const constructor = this.constructor as typeof ProgressiveElement;
    constructor.delegatedEvents?.forEach((event) => this.addEventListener(event, this));
  }

  // @ts-ignore
  handleEvent(event: AnyEvent): void {}
}
