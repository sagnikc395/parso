import re
import pytest
from parso.types import ParserInput, Position, Ok, Err
from parso.primitives import char, string, regex

@pytest.mark.parametrize("input_text, expected", [
    ("hello", "h"),
    ("apple", "a"),
])
def test_char_success(input_text, expected):
    result = char(expected).parse(ParserInput(input_text, Position(0, 1, 1)))
    assert isinstance(result, Ok)
    assert result.value.value == expected

def test_char_failure():
    result = char("x").parse(ParserInput("hello", Position(0, 1, 1)))
    assert isinstance(result, Err)

def test_string_success():
    result = string("hello").parse(ParserInput("hello world", Position(0, 1, 1)))
    assert result.value.value == "hello"

def test_string_failure():
    result = string("bye").parse(ParserInput("hello", Position(0, 1, 1)))
    assert isinstance(result, Err)

def test_regex_success():
    result = regex(re.compile(r"\d+"), "digit").parse(ParserInput("123abc", Position(0, 1, 1)))
    assert result.value.value == "123"

def test_regex_failure():
    result = regex(re.compile(r"\d+"), "digit").parse(ParserInput("abc", Position(0, 1, 1)))
    assert isinstance(result, Err)
