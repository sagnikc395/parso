import pytest
from parso.types import Position, ParserInput

from parso.utils import update_position

@pytest.mark.parametrize("text, start, expected", [
    ("abc", Position(0, 1, 1), Position(3, 1, 4)),
    ("a\nb", Position(0, 1, 1), Position(3, 2, 2)),
    ("foo\nbar\nbaz", Position(0, 1, 1), Position(11, 3, 4)),
])
def test_update_position(text, start, expected):
    updated = update_position(ParserInput("irrelevant", start), text)
    assert updated == expected
