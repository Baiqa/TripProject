import { getCurrencyDigits } from "@/lib/money/currencies";

/**
 * Разбивает целое число минимальных единиц на знак/целую/дробную часть
 * без float-арифметики (Math.trunc и % на safe integer — точны).
 */
function splitMinor(amountMinor: number, digits: number) {
  if (!Number.isInteger(amountMinor)) {
    throw new Error("amountMinor must be an integer");
  }
  const scale = 10 ** digits;
  const negative = amountMinor < 0;
  const abs = Math.abs(amountMinor);
  const major = Math.trunc(abs / scale);
  const fraction = abs % scale;
  return { negative, major, fraction, scale };
}

/**
 * Минимальные единицы → строка для редактируемого поля ввода ("1000.50"),
 * без parseFloat/toFixed — для инициализации формы значением из БД.
 */
export function minorToDecimalString(amountMinor: number, currency: string): string {
  const digits = getCurrencyDigits(currency);
  const { negative, major, fraction } = splitMinor(amountMinor, digits);
  const fractionPart = digits === 0 ? "" : `.${String(fraction).padStart(digits, "0")}`;
  return `${negative ? "-" : ""}${major}${fractionPart}`;
}

/**
 * Отображение суммы через Intl.NumberFormat (правило CLAUDE.md).
 * Деление на scale используется только здесь, для отображения,
 * а не в денежных расчётах.
 */
export function formatMoney(amountMinor: number, currency: string, locale = "ru-RU"): string {
  const digits = getCurrencyDigits(currency);
  const { negative, major, fraction, scale } = splitMinor(amountMinor, digits);
  const numericValue = (negative ? -1 : 1) * (major + fraction / scale);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(numericValue);
}
