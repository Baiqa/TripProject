import { describe, expect, it } from "vitest";
import { parseMoneyInput } from "@/lib/money";

describe("parseMoneyInput", () => {
  it("US07 AC01: parses a comma decimal separator", () => {
    expect(parseMoneyInput("1000,50", "KZT")).toBe(100050);
  });

  it("US07 AC02: parses a dot decimal separator the same way", () => {
    expect(parseMoneyInput("1000.5", "KZT")).toBe(100050);
  });

  it("parses an integer amount without a fractional part", () => {
    expect(parseMoneyInput("1000", "KZT")).toBe(100000);
  });

  it("CLAUDE.md: rejects empty input", () => {
    expect(parseMoneyInput("", "KZT")).toBeNull();
    expect(parseMoneyInput("   ", "KZT")).toBeNull();
  });

  it("US08 AC02: rejects non-numeric input", () => {
    expect(parseMoneyInput("абв", "KZT")).toBeNull();
  });

  it("rejects more fractional digits than the currency supports", () => {
    expect(parseMoneyInput("10.123", "KZT")).toBeNull();
  });

  it("parses a negative amount (caller validates sign, see US08 AC01)", () => {
    expect(parseMoneyInput("-500", "KZT")).toBe(-50000);
  });

  it("US09: parses a very large amount exactly", () => {
    expect(parseMoneyInput("999999999.00", "KZT")).toBe(99_999_999_900);
  });

  it("handles a zero-digit currency without a fractional part", () => {
    expect(parseMoneyInput("1000", "JPY")).toBe(1000);
    expect(parseMoneyInput("1000.5", "JPY")).toBeNull();
  });
});
