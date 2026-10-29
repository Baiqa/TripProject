/**
 * Число знаков минимальной единицы валюты (ISO 4217).
 * KZT..AED — поддерживаемые валюты проекта (раздел 4.5 ТЗ).
 * JPY — добавлена для полноты таблицы ISO 4217 и проверки валют
 * с отличным от 2 числом знаков; в список поддерживаемых валют проекта не входит.
 */
export const CURRENCY_MINOR_DIGITS: Record<string, number> = {
  KZT: 2,
  USD: 2,
  EUR: 2,
  RUB: 2,
  TRY: 2,
  GEL: 2,
  UZS: 2,
  KGS: 2,
  CNY: 2,
  AED: 2,
  JPY: 0,
};

export function getCurrencyDigits(currency: string): number {
  const digits = CURRENCY_MINOR_DIGITS[currency];
  if (digits === undefined) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return digits;
}
