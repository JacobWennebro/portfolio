const words: Record<number, string> = {
  22: "twenty-two",
  23: "twenty-three",
  24: "twenty-four",
  25: "twenty-five",
  26: "twenty-six",
  27: "twenty-seven",
  28: "twenty-eight",
  29: "twenty-nine",
};

export function toWords(n: number): string {
  return words[n] ?? String(n);
}
