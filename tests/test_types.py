from parso.types import Position, ParserInput, success, error, Ok, Err

def test_success_type():
    pos = Position(0, 1, 1)
    inp = ParserInput("rest", pos)
    s = success("value", inp)
    assert isinstance(s, Ok)
    assert s.value.value == "value"
    assert s.value.remaining == inp

def test_error_type():
    pos = Position(10, 2, 5)
    e = error("Something went wrong", pos)
    assert isinstance(e, Err)
    assert e.error._tag == "ParserError"
    assert e.error.message == "Something went wrong"
    assert e.error.position == pos
