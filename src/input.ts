export type T = {
  offset: number;
  buffer: string;
  len: number;
};

export const create = (s: string): T => {
  return { offset: 0, buffer: s, len: s.length };
};

export const advance = (input: T): T => {
  return {
    ...input,
    offset: input.offset + 1,
  };
};

//extract substring starting from offset to end
export const to_string = (input: T): string => {
  return input.buffer.substring(input.offset, input.len);
};

// take -> takes n characters from T starting at offset
// ref: https://www.reddit.com/r/haskell/comments/uhm04p/how_does_take_function_really_work/
export const take = (n: number, input: T): string | Error => {
  if (input.offset + n >= input.len) {
    return new Error("Reached the end of the input");
  } else {
    return input.buffer.substring(input.offset, input.offset + n);
  }
};

//advance_by -> advance the offset by n
export const advance_by = (n: number, input: T): T => {
  if (input.offset + n < input.len) {
    return {
      ...input,
      offset: input.offset + n,
    };
  } else {
    return input;
  }
};
