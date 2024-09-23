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

//Monad type
export const Monad = {
  // pure function: creates a parser that always succeeds with value `v`
  pure: <A>(v: A): Parser<A> => {
    return (input: T) => ({ ok: true, value: [v, input] });
  },

  // bind function: applies `p`, then uses its output in `f`
  bind: <A, B>(p: Parser<A>, f: (a: A) => Parser<B>): Parser<B> => {
    return (input: T) => {
      const result = p(input);
      if (result.ok) {
        const [p_out, rest] = result.value;
        return f(p_out)(rest); // Apply f to the output of p and continue with rest
      } else {
        return result; // If p failed, return the error
      }
    };
  },

  // Infix operator `>>=` equivalent
  ">>=": function <A, B>(p: Parser<A>, f: (a: A) => Parser<B>): Parser<B> {
    return Monad.bind(p, f);
  },

  // `p <* q`: Sequence two parsers, but keep the result of `p`
  "<*": function <A, B>(p: Parser<A>, q: Parser<B>): Parser<A> {
    return Monad.bind(p, (pout: A) => Monad.bind(q, () => Monad.pure(pout)));
  },

  // `p *> q`: Sequence two parsers, but keep the result of `q`
  "*>": function <A, B>(p: Parser<A>, q: Parser<B>): Parser<B> {
    return Monad.bind(p, () => Monad.bind(q, (qout: B) => Monad.pure(qout)));
  },

  // Lift function to apply a pure function `f` to the result of parser `p`
  lift: function <A, B>(f: (a: A) => B, p: Parser<A>): Parser<B> {
    return Monad.bind(p, (x: A) => Monad.pure(f(x)));
  },

  // Lift2 function: apply a function `f` to the results of two parsers
  lift2: function <A, B, C>(
    f: (a: A, b: B) => C,
    p: Parser<A>,
    q: Parser<B>
  ): Parser<C> {
    return Monad.bind(p, (x: A) =>
      Monad.bind(q, (y: B) => Monad.pure(f(x, y)))
    );
  },

  // Lift3 function: apply a function `f` to the results of three parsers
  lift3: function <A, B, C, D>(
    f: (a: A, b: B, c: C) => D,
    p: Parser<A>,
    q: Parser<B>,
    r: Parser<C>
  ): Parser<D> {
    return Monad.bind(p, (x: A) =>
      Monad.bind(q, (y: B) => Monad.bind(r, (z: C) => Monad.pure(f(x, y, z))))
    );
  },

  // `void` function: run a parser and ignore its result, returning `()` (i.e., unit type)
  void: function <A>(p: Parser<A>): Parser<void> {
    return Monad.bind(p, () => Monad.pure(undefined));
  },
};
