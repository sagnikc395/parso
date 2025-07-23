import pytest
from parso.types import ParserInput, Position
from parso.common_regex import number, identifier, quoted_string, bool_true, bool_false, null

@pytest.mark.parametrize("parser, text, expected", [
    (number, "42", 42.0),
    (number, "3.14", 3.14),
    (identifier, "fooBar123", "fooBar123"),
    (quoted_string, '"hello"', "hello"),
    (bool_true, "true", True),
    (bool_false, "false", False),
    (null, "null", None),
])
def test_common_regex_parsers(parser, text, expected):
    result = parser.parse(ParserInput(text, Position(0, 1, 1)))
    assert result.value.value == expected
