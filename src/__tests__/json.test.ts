import { createInput } from "../utils";
import { createJsonParser } from "../parsers/json";
import { Effect } from "effect";

describe("JSON Parser", () => {
  const parse = (input: string) =>
    Effect.runPromise(createJsonParser().parse(createInput(input)));

  test("parses null", async () => {
    const result = await parse("null");
    expect(result.value).toBe(null);
  });

  test("parses boolean", async () => {
    expect((await parse("true")).value).toBe(true);
    expect((await parse("false")).value).toBe(false);
  });

  test("parses numbers", async () => {
    expect((await parse("123")).value).toBe(123);
    expect((await parse("-42.5")).value).toBe(-42.5);
  });

  test("parses strings", async () => {
    expect((await parse('"hello"')).value).toBe("hello");
  });

  test("parses arrays", async () => {
    const result = await parse('[1, true, "hello", null]');
    expect(result.value).toEqual([1, true, "hello", null]);
  });
});
