import re
from toolz import curry
from .types import ParserInput, Result, Parser, Success, Ok, Err
from .utils import update_position, success, error

@curry
def char(expected: str) -> Parser[str]:
    def parse_fn(input: ParserInput) -> Result[Success[str]]:
        if input.text and input.text[0] == expected:
            remaining = ParserInput(
                text=input.text[1:],
                position=update_position(input, expected)
            )
            return Ok(success(expected, remaining))
        return Err(error(f"Expected '{expected}', got '{input.text[0] if input.text else 'EOF'}'", input.position))
    return Parser(parse_fn)

@curry
def string(expected: str) -> Parser[str]:
    def parse_fn(input: ParserInput) -> Result[Success[str]]:
        if input.text.startswith(expected):
            remaining = ParserInput(
                text=input.text[len(expected):],
                position=update_position(input, expected)
            )
            return Ok(success(expected, remaining))
        return Err(error(f'Expected "{expected}", got "{input.text[:len(expected)]}"', input.position))
    return Parser(parse_fn)

@curry
def regex(pattern: re.Pattern, description: str) -> Parser[str]:
    def parse_fn(input: ParserInput) -> Result[Success[str]]:
        match = pattern.match(input.text)
        if match:
            matched = match.group(0)
            remaining = ParserInput(
                text=input.text[len(matched):],
                position=update_position(input, matched)
            )
            return Ok(success(matched, remaining))
        return Err(error(f"Expected {description}", input.position))
    return Parser(parse_fn)
