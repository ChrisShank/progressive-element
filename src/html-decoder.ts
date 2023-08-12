export type Decoder<Data = any, Name extends string = string> = {
  readonly name: Name;
  readonly decode: (blob: string) => Data;
  readonly encode: (data: Data) => string;
};

export type InferDecoderName<P> = P extends Decoder<any, infer Name> ? Name : never;

export type InferDecoderData<P> = P extends Decoder<infer Data> ? Data : never;

export function str<Name extends string>(name: Name): Decoder<string, Name> {
  return {
    name,
    decode: (blob) => blob,
    encode: (data) => data.toString(),
  };
}

export function boolean<Name extends string>(name: Name): Decoder<boolean, Name> {
  return {
    name,
    decode: (blob) => blob === 'true',
    encode: (data) => data.toString(),
  };
}

export function int<Name extends string>(name: Name): Decoder<number, Name> {
  return {
    name,
    decode: (blob) => parseInt(blob),
    encode: (data) => data.toString(),
  };
}

export function float<Name extends string>(name: Name): Decoder<number, Name> {
  return {
    name,
    decode: (blob) => parseFloat(blob),
    encode: (data) => data.toString(),
  };
}

interface HTMLResult<Decoders extends (Decoder | HTMLResult)[] = any[]> {
  strings: TemplateStringsArray;
  values: Decoders;
}

export function html<Decoders extends (Decoder | HTMLResult<any>)[]>(
  strings: TemplateStringsArray,
  ...values: Decoders
): HTMLResult<Decoders> {
  return { strings, values };
}

export type InferDecodersFromHTMLResult<Result extends HTMLResult> = Result extends HTMLResult<
  infer Decoders
>
  ? Decoders
  : never;

export type FlattenDecoders<
  Values extends ReadonlyArray<unknown>,
  Result extends ReadonlyArray<unknown> = []
> = Values extends readonly []
  ? Result
  : Values extends readonly [infer Head, ...infer Tail]
  ? Head extends HTMLResult
    ? FlattenDecoders<Tail, readonly [...Result, ...InferDecodersFromHTMLResult<Head>]>
    : FlattenDecoders<Tail, readonly [...Result, Head]>
  : never;

export type ExtractValuesFromDecoders<Decoders extends Decoder[]> = Prettify<{
  [Value in Decoders[keyof Decoders] as InferDecoderName<Value>]: InferDecoderData<Value>;
}>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export function renderToString<Result extends HTMLResult>(
  result: Result,
  values: ExtractValuesFromDecoders<FlattenDecoders<InferDecodersFromHTMLResult<Result>>>
): string {
  let string = '';
  for (let i = 0; i < result.strings.length; i++) {
    string += result.strings[i];

    const decoder = result.values[i] as Decoder;
    if (decoder !== undefined) {
      const value = (values as Record<string, any>)[decoder.name];
      string += decoder.encode(value);
    }
  }

  return string;
}

export function renderToDOM<Result extends HTMLResult>(result: Result) {}

const foo = html`<div>${boolean('foo')}</div>`;
const bar = html`<div>${str('baz')}</div>`;
const baz = html`<div>${foo} ${int('bar')} ${bar}</div>`;

const result = renderToString(baz, {
  foo: true,
  bar: 2,
  baz: '2',
});
