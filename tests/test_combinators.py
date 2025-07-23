from parso.types import ParserInput, Position
from parso.primitives import char
from parso.combinators import map, flat_map, many, optional, choice, seq

def test_map_uppercase():
    parser = map(char("a"), str.upper)
    result = parser.parse(ParserInput("abc", Position(0, 1, 1)))
    assert result.value.value == "A"

def test_flat_map_success():
    parser = flat_map(char("a"), lambda _: char("b"))
    result = parser.parse(ParserInput("abc", Position(0, 1, 1)))
    assert result.value.value == "b"

def test_many_parser():
    parser = many(char("a"))
    result = parser.parse(ParserInput("aaab", Position(0, 1, 1)))
    assert result.value.value == ["a", "a", "a"]

def test_optional_present():
    result = optional(char("x")).parse(ParserInput("xray", Position(0, 1, 1)))
    assert result.value.value == "x"

def test_optional_absent():
    result = optional(char("x")).parse(ParserInput("abc", Position(0, 1, 1)))
    assert result.value.value is None

def test_choice_success():
    parser = choice([char("x"), char("y"), char("z")])
    result = parser.parse(ParserInput("yoo", Position(0, 1, 1)))
    assert result.value.value == "y"

def test_seq_parser():
    parser = seq([char("a"), char("b"), char("c")])
    result = parser.parse(ParserInput("abc", Position(0, 1, 1)))
    assert result.value.value == ["a", "b", "c"]
