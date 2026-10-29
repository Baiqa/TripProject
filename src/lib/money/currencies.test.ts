import { describe, expect, it } from "vitest";
import { getCurrencyDigits } from "@/lib/money";

describe("getCurrencyDigits", () => {
  it("EXP-10-prep: returns 2 for KZT", () => {
    expect(getCurrencyDigits("KZT")).toBe(2);
  });

  it("returns 0 for a currency without minor units (JPY)", () => {
    expect(getCurrencyDigits("JPY")).toBe(0);
  });

  it("rejects an unsupported currency code", () => {
    expect(() => getCurrencyDigits("XXX")).toThrow(/Unsupported currency/);
  });
});
