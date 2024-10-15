import { bind, pure } from "./monad";
import type { Parser } from "./parser";

export const is_digit = (char: string): boolean => {
  return char != null && char !== "" && !isNaN(Number(char.toString()));
};

export const is_html_char = (char: string): boolean => {
  if (
    char >= "a" ||
    char <= "z" ||
    char >= "A" ||
    char <= "Z" ||
    char >= "0" ||
    char <= "9" ||
    char == " " ||
    char == "\t" ||
    char == "\n"
  ) {
    return true;
  }
  return false;
};

export function leftSeq<A, B>(p: Parser<A>, q: Parser<B>): Parser<A> {
  return bind(p, (pOut) => bind(q, () => pure(pOut)));
}

export function rightSeq<A, B>(p: Parser<A>, q: Parser<B>): Parser<B> {
  return bind(p, () => q);
}

export function lift<A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> {
  return bind(p, (x) => pure(f(x)));
}

export function lift2<A, B, C>(
  f: (a: A, b: B) => C,
  p: Parser<A>,
  q: Parser<B>
): Parser<C> {
  return bind(p, (x) => bind(q, (y) => pure(f(x, y))));
}

export function lift3<A, B, C, D>(
  f: (a: A, b: B, c: C) => D,
  p: Parser<A>,
  q: Parser<B>,
  r: Parser<C>
): Parser<D> {
  return bind(p, (x) => bind(q, (y) => bind(r, (z) => pure(f(x, y, z)))));
}

export function voidType<T>(p: Parser<T>): Parser<void> {
  return bind(p, () => pure(undefined));
}
