/**
 * Форматирование сумм только для макетов (см. src/mocks/demo-trip.ts).
 * Реальный форматтер с полной таблицей ISO 4217 появится в
 * src/lib/money на этапе 2 — этот временный хелпер знает только валюты
 * демо-сценария.
 */
const DEMO_MINOR_DIGITS: Record<string, number> = {
  KZT: 2,
  USD: 2,
  TRY: 2,
};

export function formatDemoMoney(amountMinor: number, currency: string): string {
  const digits = DEMO_MINOR_DIGITS[currency] ?? 2;
  const amount = amountMinor / 10 ** digits;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDemoDate(isoDate: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${isoDate}T00:00:00`),
  );
}

export function formatDemoDateTime(isoDateTime: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDateTime));
}
