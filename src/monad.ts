import { Ok } from "ts-results";
import type { Parser } from "./parser";

export function pure<T>(v: T): Parser<T> {
  return (input) => Ok([v, input]);
}

export function bind<A, B>(p: Parser<A>, f: (a: A) => Parser<B>): Parser<B> {
  return (input) => {
    const result = p(input);
    return result.andThen(([pOut, rest]) => f(pOut)(rest));
  };
}
