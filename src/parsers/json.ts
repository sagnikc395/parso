//example of a json parser that was shown in the talk
// rewritten in typescript

import type { Parser } from "../types";
import { regex, string } from "../primitives";
import { seq, or, map, many, optional } from "../combinators";
import { whitespace } from "../common-regex";
import { Option } from "effect";

export const createJsonParser = (): Parser<unknown> => {
  const ws = optional(whitespace);

  let value: Parser<unknown>;

  const null_ = map(string("null"), () => null);
  const true_ = map(string("true"), () => true);
  const false_ = map(string("false"), () => false);
  const boolean = or(true_, false_);

  const number = map(
    regex(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number"),
    Number
  );

  const stringLiteral = map(regex(/^"(?:\\.|[^"\\])*"/, "string"), (str) =>
    JSON.parse(str)
  );

  const array = map(
    seq(
      string("["),
      seq(
        ws,
        seq(
          optional(
            seq(
              value,
              many(
                map(
                  seq(seq(ws, string(",")), seq(ws, value)),
                  ([[, [, val]]]) => val
                )
              )
            )
          ),
          seq(ws, string("]"))
        )
      )
    ),
    ([[, [, [optionalFirst, [,]]]]]) =>
      optionalFirst.pipe(
        Option.match({
          onNone: () => [],
          onSome: ([first, rest]) => [first, ...rest],
        })
      )
  );

  value = or(or(or(null_, boolean), or(number, stringLiteral)), array);

  return value;
};
