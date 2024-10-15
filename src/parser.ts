import { Result, Ok, Err } from "ts-results";

type Input = string;

interface InputModule {
  readChar: (input: Input) => Result<string, string>;
  advance: (input: Input) => Input;
  advanceBy: (n: number) => (input: Input) => Input;
  take: (n: number) => (input: Input) => Result<string, string>;
}

//input module implementation
const Input: InputModule = {
  readChar: (input) => (input.length > 0 ? Ok(input[0]) : Err("End of Input")),
  advance: (input) => input.slice(1),
  advanceBy: (n) => (input) => input.slice(n),
  take: (n) => (input) =>
    input.length >= n ? Ok(input.slice(0, n)) : Err("Not enough input"),
};

//parser type
type Parser<T> = (input: Input) => Result<[T, Input], string>;

