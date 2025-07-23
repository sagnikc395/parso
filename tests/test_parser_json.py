import pytest
from parso.types import ParserInput, Position
from parso.parser_json import json_value

@pytest.mark.parametrize("text, expected", [
    ('null', None),
    ('true', True),
    ('false', False),
    ('123.45', 123.45),
    ('"hello"', "hello"),
    ('[1, 2, 3]', [1.0, 2.0, 3.0]),
    ('{"x": 1}', {"x": 1.0}),
])
def test_json_value_parsing(text, expected):
    result = json_value().parse(ParserInput(text, Position(0, 1, 1)))
    assert result.value.value == expected
