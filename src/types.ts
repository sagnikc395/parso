//define the types and structure of the input
import { Either } from "effect";
import { Effect } from "effect";

export interface Position {
  readonly index: number;
  readonly line: number;
  readonly column: number;
}

export interface ParserInput {
  readonly text: string;
  readonly position: Position;
}

export type ParserError = {
  readonly _tag: "ParserError";
  readonly message: string;
  readonly position: Position;
};

export type Success<A> = {
  readonly _tag: "Success";
  readonly value: A;
  readonly remaining: ParserInput;
};

export type ParserResult<A> = Either.Either<ParserError, Success<A>>;

export interface Parser<A> {
  readonly parse: (
    input: ParserInput
  ) => Effect.Effect<never, ParserError, Success<A>>;
}

