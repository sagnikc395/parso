import type { Parser } from "./parser";

export function map<A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> {
  return (input) => {
    const result = p(input);
    return result.map(([out, rest]) => [f(out), rest]);
  };
}
