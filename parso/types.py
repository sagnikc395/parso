# define the basic types for the parser combinator

from dataclasses import dataclass
from typing import Callable, TypeVar,Generic, Union
from toolz import curry
from pipe import Pipe, chain

A = TypeVar("A")

@dataclass(frozen=True)
class Position:
    index: int
    line: int
    column: int

@dataclass(frozen=True)
class ParserInput:
    text: str
    position: Position


@dataclass(frozen=True)
class ParserError:
    _tag: str
    message: str
    position: Position


@dataclass(frozen=True)
class Success(Generic[A]):
    _tag: str
    value: A
    remaining: ParserInput


@dataclass(frozen=True)
class ParserResult(Generic[A]):
    pass

@dataclass(frozen=True)
class Ok(Result, Generic[A]):
    value: A

@dataclass(frozen=True)
class Err(Result):
    error: ParserError

ParserResult = Result[Success[A]]


# parser structure
class Parser(Generic[A]):
    def __init__(self, parse_fn: Callable[[ParserInput], Result[Success[A]]]):
        self._parse_fn = parse_fn

    def parse(self, input: ParserInput) -> Result[Success[A]]:
        return self._parse_fn(input)

    def map(self, fn: Callable[[A], A]) -> 'Parser[A]':
        """Functional map on parser output value"""
        def mapped_parser(input: ParserInput) -> Result[Success[A]]:
            result = self.parse(input)
            if isinstance(result, Ok):
                success = result.value
                return Ok(Success(_tag="Success", value=fn(success.value), remaining=success.remaining))
            return result
        return Parser(mapped_parser)

    def flat_map(self, fn: Callable[[A], 'Parser[A]']) -> 'Parser[A]':
        """Monadic bind for chaining parsers"""
        def flat_mapped_parser(input: ParserInput) -> Result[Success[A]]:
            result = self.parse(input)
            if isinstance(result, Ok):
                success = result.value
                return fn(success.value).parse(success.remaining)
            return result
        return Parser(flat_mapped_parser)
