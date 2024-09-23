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

// Functor
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

//Monad
export const Monad = {};

// MonadFail
export const MonadFail = {
  fail: <A>(msg: string): Parser<A> => {
    return () => ({
      ok: false,
      error: msg,
    });
  },
};

//Alternative
export const Alternative = {
  //tries `p` and `q`, and returns the result of the first successful parser
  or: <A>(p: Parser<A>, q: Parser<A>): Parser<A> => {
    return (input: T) => {
      const pResult = p(input);
      const qResult = q(input);

      if (pResult.ok) {
        return pResult;
      } else if (qResult.ok) {
        return qResult;
      } else {
        return pResult; // Return the first error if both fail
      }
    };
  },
};
