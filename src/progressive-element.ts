export interface AnyEvent {
  type: string;
  [key: string]: any;
}

function kebabize(str: string) {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

/**
 * A tiny base class to define custom elements with. It provides a static `register` method and delegates events based on the `delegatedEvents` static property. All delegated events are called with the `handleEvent` method.
 */
export class ProgressiveElement extends HTMLElement implements EventListenerObject {
  /**
   * Register the custom element with the window. By default then name of the custom element is the kebab-case of the class name.
   */
  static register() {
    customElements.define(kebabize(this.name), this);
  }

  /**
   * A list of event types to be delegated for the lifetime of the custom element.
   */
  static delegatedEvents?: AnyEventType[];

  constructor() {
    super();

    const constructor = this.constructor as typeof ProgressiveElement;
    constructor.delegatedEvents?.forEach((event) => this.addEventListener(event, this));
  }

  /**
   * This method is called any time an event is delegated. It's a central handler to handle events for this custom element. No need to call `super.handleEvent()`.
   * @param event
   */
  // @ts-ignore unused parameter
  handleEvent(event: Event): void {}
}
