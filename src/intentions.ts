export interface Intention {
  intention: string;
  target: Element;
}

/**
 * Given a DOM event this utility function finds the closest intention. An intention is a DOM attribute that maps a DOM event to a semantically meaningful event. The attribute takes the shape `${prefix}${event.type}${modifiers?}="${semantic event}"`.
 * @param event DOM event
 * @param modifier A function that adds a modifier to the intention. Useful for keyboard modifiers.
 * @param prefix By default intentions are prefixed with `on:`, use this to override that prefix.
 * @returns
 */
export function findClosestIntention(
  event: Event,
  modifier?: (event: Event) => string,
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

/**
 * A utility that adds modifiers from keyboard events to intentions.
 * @param event DOM event
 * @returns
 */
export function keyboardModifiers(event: Event) {
  if (event instanceof KeyboardEvent) {
    const systemModifiers = systemKeys
      .filter((key) => event[`${key}Key` as keyof KeyboardEvent])
      .join('.');
    return `${systemModifiers.length > 0 ? '.' : ''}${systemModifiers}.${event.code.toLowerCase()}`;
  }
  return '';
}
