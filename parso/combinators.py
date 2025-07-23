from typing import Callable, List
from .types import Parser, Result, Ok, Err, Success
from .utils import success, error
from toolz import curry

def map(parser: Parser, fn: Callable) -> Parser:
    def parse_fn(input):
        result = parser.parse(input)
        if isinstance(result, Ok):
            s = result.value
            return Ok(success(fn(s.value), s.remaining))
        return result
    return Parser(parse_fn)

def flat_map(parser: Parser, fn: Callable) -> Parser:
    def parse_fn(input):
        result = parser.parse(input)
        if isinstance(result, Ok):
            s = result.value
            return fn(s.value).parse(s.remaining)
        return result
    return Parser(parse_fn)

def many(parser: Parser) -> Parser:
    def parse_fn(input):
        results = []
        current_input = input
        while True:
            result = parser.parse(current_input)
            if isinstance(result, Ok):
                s = result.value
                results.append(s.value)
                current_input = s.remaining
            else:
                break
        return Ok(success(results, current_input))
    return Parser(parse_fn)

def optional(parser: Parser) -> Parser:
    def parse_fn(input):
        result = parser.parse(input)
        if isinstance(result, Ok):
            return result
        return Ok(success(None, input))
    return Parser(parse_fn)

def choice(parsers: List[Parser]) -> Parser:
    def parse_fn(input):
        for p in parsers:
            result = p.parse(input)
            if isinstance(result, Ok):
                return result
        return Err(error("No matching choice", input.position))
    return Parser(parse_fn)

def seq(parsers: List[Parser]) -> Parser:
    def parse_fn(input):
        values = []
        current_input = input
        for p in parsers:
            result = p.parse(current_input)
            if isinstance(result, Err):
                return result
            s = result.value
            values.append(s.value)
            current_input = s.remaining
        return Ok(success(values, current_input))
    return Parser(parse_fn)
