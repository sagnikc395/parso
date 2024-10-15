export const is_digit = (char: string): boolean => {
  return char != null && char !== "" && !isNaN(Number(char.toString()));
};

export const is_html_char = (char: string): boolean => {
  if (
    char >= "a" ||
    char <= "z" ||
    char >= "A" ||
    char <= "Z" ||
    char >= "0" ||
    char <= "9" ||
    char == " " ||
    char == "\t" ||
    char == "\n"
  ) {
    return true;
  }
  return false;
};
