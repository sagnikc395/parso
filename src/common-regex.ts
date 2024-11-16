import { regex } from "./primitives";

export const whitespace = regex(/^\s+/, "whitespace");
export const digits = regex(/^\d+/, "digits");
export const letters = regex(/^[a-zA-Z]+/, "letters");
export const word = regex(/^\w+/, "word");
export const integer = regex(/^-?\d+/, "integer");
export const float = regex(/^-?\d*\.\d+/, "float");
export const identifier = regex(/^[a-zA-Z_][a-zA-Z0-9_]*/, "identifier");
