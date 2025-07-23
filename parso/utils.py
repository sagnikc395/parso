from parso.types import ParserError, ParserInput, Position, Success

def update_position(input: ParserInput, consumed: str) -> Position:
    lines = consumed.splitlines()
    if len(lines) == 1:
        return Position(
            index=input.position.index + len(consumed),
            line=input.position.line,
            column=input.position.column + len(consumed),
        )
    else:
        return Position(
            index=input.position.index + len(consumed),
            line=input.position.line + len(lines) - 1,
            column=len(lines[-1]) + 1,
        )

def success(value, remaining: ParserInput) -> Success:
    return Success(_tag="Success", value=value, remaining=remaining)

def error(message: str, position: Position) -> ParserError:
    return ParserError(_tag="ParserError", message=message, position=position)
