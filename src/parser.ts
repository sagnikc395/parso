import type { T } from "./input";

export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: string;
    };
export type Parser<A> = (input: T) => Result<[A, T]>;

// Functor module
export const Functor = {
  // map function: applies function `f` to the result of the parser `p`
  map: <A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> => {
    return (input: T) => {
      const result = p(input);
      if (result.ok) {
        const [out, rest] = result.value;
        return { ok: true, value: [f(out), rest] };
      } else {
        return result; // Keep the error as is
      }
    };
  },
};

export const Fold = <A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> => {
  return Functor.map(f, p);
};
