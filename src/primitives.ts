import { Effect } from "effect";
import { Either } from "effect";
import type { Parser } from "./types";
import { success, error, updatePosition } from "./utils";

export const char = (expected: string): Parser<string> => ({
  parse: (input) =>
    Effect.succeed(() => {
      if (input.text.charAt(0) === expected) {
        const remaining = {
          text: input.text.slice(1),
          position: updatePosition(input, expected),
        };
        return Either.right(success(expected, remaining));
      }
      return Either.left(
        error(
          `Expected '${expected}', got '${input.text.charAt(0)}'`,
          input.position
        )
      );
    }),
});

export const string = (expected: string): Parser<string> => ({
  parse: (input) =>
    Effect.succeed(() => {
      if (input.text.startsWith(expected)) {
        const remaining = {
          text: input.text.slice(expected.length),
          position: updatePosition(input, expected),
        };
        return Either.right(success(expected, remaining));
      }
      return Either.left(
        error(
          `Expected "${expected}", got "${input.text.slice(
            0,
            expected.length
          )}"`,
          input.position
        )
      );
    }),
});

export const regex = (
  pattern: RegExp,
  description: string
): Parser<string> => ({
  parse: (input) =>
    Effect.succeed(() => {
      const match = pattern.exec(input.text);
      if (match && match.index === 0) {
        const matched = match[0];
        const remaining = {
          text: input.text.slice(matched.length),
          position: updatePosition(input, matched),
        };
        return Either.right(success(matched, remaining));
      }
      return Either.left(error(`Expected ${description}`, input.position));
    }),
});
