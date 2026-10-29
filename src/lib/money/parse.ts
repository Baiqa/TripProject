import { getCurrencyDigits } from "@/lib/money/currencies";

/**
 * Разбор денежного ввода («1000,50» или «1000.5») в минимальные единицы
 * валюты, без parseFloat (который теряет точность и допускает мусор вроде
 * "1e3"). Возвращает null при пустом или нечисловом вводе — отрицательные
 * числа и ноль парсятся (это валидные числа), проверку "больше нуля"
 * выполняет вызывающий код (см. ExpenseForm, US08).
 */
export function parseMoneyInput(input: string, currency: string): number | null {
  const digits = getCurrencyDigits(currency);
  const trimmed = input.trim();
  if (trimmed === "") return null;

  const normalized = trimmed.replace(",", ".");
  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(normalized);
  if (!match) return null;

  const [, sign, integerPart, fractionPartRaw = ""] = match;
  if (fractionPartRaw.length > digits) return null;

  const fractionPart = fractionPartRaw.padEnd(digits, "0");
  const scale = BigInt(10) ** BigInt(digits);
  const minorUnsigned =
    BigInt(integerPart) * scale + (fractionPart === "" ? BigInt(0) : BigInt(fractionPart));

  if (minorUnsigned > BigInt(Number.MAX_SAFE_INTEGER)) return null;

  const minor = Number(minorUnsigned);
  return sign ? -minor : minor;
}
