import type { Parser } from "./types";
import { Option, Effect } from "effect";
import { success } from "./utils";

export const seq = <A, B>(p1: Parser<A>, p2: Parser<B>): Parser<[A, B]> => ({
  parse: (input) =>
    Effect.flatMap(p1.parse(input), (result1) =>
      Effect.map(p2.parse(result1.remaining), (result2) =>
        success([result1.value, result2.value], result2.remaining)
      )
    ),
});

export const or = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => ({
  parse: (input) => Effect.catchAll(p1.parse(input), () => p2.parse(input)),
});

export const map = <A, B>(parser: Parser<A>, fn: (a: A) => B): Parser<B> => ({
  parse: (input) =>
    Effect.map(parser.parse(input), (result) =>
      success(fn(result.value), result.remaining)
    ),
});

export const many = <A>(parser: Parser<A>): Parser<A[]> => ({
  parse: (input) => {
    const results: A[] = [];
    let currentInput = input;

    const parseNext = (): Effect.Effect<never, ParserError, Success<A[]>> =>
      Effect.catchAll(
        Effect.flatMap(parser.parse(currentInput), (result) => {
          results.push(result.value);
          currentInput = result.remaining;
          return parseNext();
        }),
        () => Effect.succeed(success(results, currentInput))
      );

    return parseNext();
  },
});

export const many1 = <A>(parser: Parser<A>): Parser<A[]> => ({
  parse: (input) =>
    Effect.flatMap(parser.parse(input), (firstResult) =>
      Effect.map(many(parser).parse(firstResult.remaining), (restResults) =>
        success(
          [firstResult.value, ...restResults.value],
          restResults.remaining
        )
      )
    ),
});

export const optional = <A>(parser: Parser<A>): Parser<Option.Option<A>> => ({
  parse: (input) =>
    Effect.catchAll(
      Effect.map(parser.parse(input), (result) =>
        success(Option.some(result.value), result.remaining)
      ),
      () => Effect.succeed(success(Option.none(), input))
    ),
});

export const sepBy = <A, S>(
  parser: Parser<A>,
  separator: Parser<S>
): Parser<A[]> => ({
  parse: (input) =>
    Effect.catchAll(
      Effect.flatMap(parser.parse(input), (firstResult) =>
        Effect.map(
          many(map(seq(separator, parser), ([, value]) => value)).parse(
            firstResult.remaining
          ),
          (restResults) =>
            success(
              [firstResult.value, ...restResults.value],
              restResults.remaining
            )
        )
      ),
      () => Effect.succeed(success([], input))
    ),
});

export const between = <L, A, R>(
  left: Parser<L>,
  parser: Parser<A>,
  right: Parser<R>
): Parser<A> => map(seq(seq(left, parser), right), ([[, value]]) => value);
