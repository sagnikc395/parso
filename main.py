from parso.types import ParserInput, Position
from parso.parser_json import json_value

def main():
    input = ParserInput('{"name": "Alice", "age": 30, "isMember": true}', Position(0, 1, 1))
    result = json_value().parse(input)
    print(result)

if __name__ == "__main__":
    main()
