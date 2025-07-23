from .types import ParserInput, Parser, Ok, Err, Result
from .primitives import char, string
from .common-regex import number, quoted_string, bool_true, bool_false, null, whitespace
from .combinators import map, flat_map, many, choice, optional, seq
from .utils import success, error

import json

def trim(p: Parser) -> Parser:
    return flat_map(optional(whitespace), lambda _: flat_map(p, lambda x: optional(whitespace) and Parser(lambda i: Ok(success(x, i)))))

def json_null():
    return map(trim(null), lambda _: None)

def json_bool():
    return choice([
        map(trim(bool_true), lambda _: True),
        map(trim(bool_false), lambda _: False)
    ])

def json_number():
    return map(trim(number), lambda s: float(s))

def json_string():
    return map(trim(quoted_string), lambda s: json.loads(s))

def json_array():
    def build():
        return flat_map(char("["), lambda _:
            flat_map(optional(whitespace), lambda _:
                flat_map(optional(json_value()), lambda first:
                    flat_map(many(
                        flat_map(char(","), lambda _:
                            json_value())
                    ), lambda rest:
                        flat_map(char("]"), lambda _:
                            Parser(lambda i: Ok(success(
                                [first] + rest if first is not None else [],
                                i
                            )))
                        )
                    )
                )
            )
        )
    return Parser(lambda input: build().parse(input))

def json_object():
    def build():
        return flat_map(char("{"), lambda _:
            flat_map(optional(whitespace), lambda _:
                flat_map(optional(json_pair()), lambda first:
                    flat_map(many(
                        flat_map(char(","), lambda _:
                            json_pair())
                    ), lambda rest:
                        flat_map(char("}"), lambda _:
                            Parser(lambda i: Ok(success(
                                dict([first] + rest) if first else {},
                                i
                            )))
                        )
                    )
                )
            )
        )
    return Parser(lambda input: build().parse(input))

def json_pair():
    return flat_map(json_string(), lambda key:
        flat_map(char(":"), lambda _:
            map(json_value(), lambda value:
                (key, value)
            )
        )
    )

def json_value():
    return choice([
        json_null(),
        json_bool(),
        json_number(),
        json_string(),
        json_array(),
        json_object()
    ])
