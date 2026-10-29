import { describe, expect, it } from "vitest";
import { checkExactSplit, splitEqual, sumShares } from "@/lib/money";

describe("splitEqual", () => {
  it("CLAUDE.md: splits evenly with one participant (gets the full amount)", () => {
    expect(splitEqual(10000, ["a"])).toEqual({ a: 10000 });
  });

  it("BR-02: 1000,00 ₸ on three participants gives 334/333/333", () => {
    expect(splitEqual(100000, ["a", "b", "c"])).toEqual({ a: 33334, b: 33333, c: 33333 });
  });

  it("CLAUDE.md: 1 minor unit on three participants — remainder to the first by join order", () => {
    expect(splitEqual(1, ["a", "b", "c"])).toEqual({ a: 1, b: 0, c: 0 });
  });

  it("is deterministic for the same input", () => {
    expect(splitEqual(100, ["a", "b", "c"])).toEqual(splitEqual(100, ["a", "b", "c"]));
  });

  it("CLAUDE.md: a very large sum splits without precision loss", () => {
    const result = splitEqual(99_999_999_900, ["a", "b", "c", "d", "e", "f", "g"]);
    expect(sumShares(result)).toBe(99_999_999_900);
    expect(Object.values(result).every((v) => Number.isInteger(v))).toBe(true);
  });

  it("CLAUDE.md: empty input returns no shares", () => {
    expect(splitEqual(1000, [])).toEqual({});
  });

  it("CLAUDE.md: rejects a negative amount (invalid input)", () => {
    expect(() => splitEqual(-100, ["a"])).toThrow(/non-negative integer/);
  });

  it("rejects a non-integer amount", () => {
    expect(() => splitEqual(10.5, ["a"])).toThrow(/non-negative integer/);
  });
});

describe("checkExactSplit", () => {
  it("US02 AC01: balanced when shares sum to the total", () => {
    expect(checkExactSplit(5000, { a: 3000, b: 2000 })).toEqual({ balanced: true, remainder: 0 });
  });

  it("US02 AC02 / US03 AC01: reports an under-distributed remainder", () => {
    expect(checkExactSplit(5000, { a: 3000, b: 1500 })).toEqual({ balanced: false, remainder: 500 });
  });

  it("US03 AC02: reports a negative remainder when shares exceed the total", () => {
    expect(checkExactSplit(5000, { a: 3000, b: 2500 })).toEqual({ balanced: false, remainder: -500 });
  });

  it("CLAUDE.md: empty shares leaves the whole amount unresolved", () => {
    expect(checkExactSplit(1000, {})).toEqual({ balanced: false, remainder: 1000 });
  });
});
