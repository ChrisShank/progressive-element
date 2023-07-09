import { nothing, TemplateResult } from 'lit';
import { DirectiveClass, DirectiveResult } from 'lit/directive';

type Primitive = null | undefined | boolean | number | string | symbol | bigint;
const isPrimitive = (value: unknown): value is Primitive =>
  value === null || (typeof value != 'object' && typeof value != 'function');

const isTemplateResult = (value: unknown): value is TemplateResult =>
  typeof value === 'object' && value != null && '_$litType$' in value;

const isDirectiveResult = (value: unknown): value is DirectiveResult =>
  typeof value === 'object' && value != null && '_$litDirective$' in value;

export function renderToString(result: unknown): string {
  if (isPrimitive(result)) {
    if (result === nothing || result == null) {
      return '';
    } else {
      return result.toString();
    }
  } else if (isTemplateResult(result)) {
    const { strings, values } = result;
    let str = '';

    for (let i = 0; i < strings.length - 1; i++) {
      str += strings[i] + renderToString(values[i]);
    }

    str += strings[strings.length - 1];
    return str;
  } else if (isDirectiveResult(result)) {
    const directiveConstructor = (result as any)[
      '_$litDirective$'
    ] as DirectiveClass;
    const directive = new directiveConstructor({} as any);
    const value = directive.render(...(result as any).values);
    return renderToString(value);
  } else if (Array.isArray(result)) {
    let str = '';
    for (const value of result) {
      str += renderToString(value);
    }
    return str;
  }

  return result + '';
}
