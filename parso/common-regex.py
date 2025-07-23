import re
from .primitives import regex

whitespace = regex(re.compile(r"\s+"), "whitespace")
number = regex(re.compile(r"-?\d+(\.\d+)?([eE][+-]?\d+)?"), "number")
integer = regex(re.compile(r"-?\d+"), "integer")
identifier = regex(re.compile(r"[a-zA-Z_][a-zA-Z0-9_]*"), "identifier")
quoted_string = regex(re.compile(r'"(?:\\.|[^"\\])*"'), "quoted string")
bool_true = regex(re.compile(r"true"), "true")
bool_false = regex(re.compile(r"false"), "false")
null = regex(re.compile(r"null"), "null")
