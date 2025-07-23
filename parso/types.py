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


class Parser(Generic[A]):
    def __init__(self,parse_fn: Callable[[ParserInput],Result[Success[A]]]):
        self._parse_fn = parse_fn

    def parse(self,input: ParserInput) -> Result[Success[A]]:
        return self._parse_fn(input)

