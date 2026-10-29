import { describe, expect, it } from "vitest";
import { formatMoney, minorToDecimalString } from "@/lib/money";

/** Exact spacing/symbols in Intl output depend on the ICU build, so tests
 * compare only the digit content, not the full locale-formatted string. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

describe("formatMoney", () => {
  it("US06 AC01: formats KZT with 2 decimal digits", () => {
    const result = formatMoney(100000, "KZT");
    expect(onlyDigits(result)).toBe("100000");
    expect(result).toMatch(/,00/);
  });

  it("US06 AC02: formats a currency with a different number of digits (JPY, 0 digits)", () => {
    const result = formatMoney(1000, "JPY");
    expect(onlyDigits(result)).toBe("1000");
    expect(result).not.toMatch(/[,.]\d/);
  });

  it("US09: formats a very large sum without losing precision", () => {
    // 999 999 999 ₸ = 99 999 999 900 минимальных единиц (BR-13, out-of-range flight payment)
    const result = formatMoney(99_999_999_900, "KZT");
    expect(onlyDigits(result)).toBe("99999999900");
    expect(result).toMatch(/,00/);
  });

  it("formats a negative amount with a minus sign", () => {
    expect(formatMoney(-500, "KZT")).toContain("-");
  });

  it("rejects a non-integer amount", () => {
    expect(() => formatMoney(10.5, "KZT")).toThrow(/integer/);
  });
});

describe("minorToDecimalString", () => {
  it("converts minor units to an editable decimal string", () => {
    expect(minorToDecimalString(123456, "KZT")).toBe("1234.56");
  });

  it("pads the fractional part to the currency's digit count", () => {
    expect(minorToDecimalString(100, "KZT")).toBe("1.00");
  });

  it("returns no fractional part for a zero-digit currency", () => {
    expect(minorToDecimalString(1000, "JPY")).toBe("1000");
  });

  it("US09: round-trips a very large sum exactly", () => {
    expect(minorToDecimalString(99_999_999_900, "KZT")).toBe("999999999.00");
  });
});
