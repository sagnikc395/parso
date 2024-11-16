import type { ParserInput, Position, Success, ParserError } from "./types";

export const createInput = (text: string): ParserInput => ({
  text,
  position: { index: 0, line: 1, column: 1 },
});

export const updatePosition = (
  input: ParserInput,
  consumed: string
): Position => {
  let { line, column } = input.position;
  for (const char of consumed) {
    if (char === "\n") {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return {
    index: input.position.index + consumed.length,
    line,
    column,
  };
};

export const success = <A>(value: A, remaining: ParserInput): Success<A> => ({
  _tag: "Success",
  value,
  remaining,
});

export const error = (message: string, position: Position): ParserError => ({
  _tag: "ParserError",
  message,
  position,
});
