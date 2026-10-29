/**
 * BR-02. Деление поровну: базовая доля floor(A/n), остаток r = A − b·n
 * достаётся первым r участникам в порядке вступления в поездку (детерминированно).
 */
export function splitEqual(amountMinor: number, participantIds: string[]): Record<string, number> {
  if (!Number.isInteger(amountMinor) || amountMinor < 0) {
    throw new Error("amountMinor must be a non-negative integer");
  }
  const n = participantIds.length;
  if (n === 0) return {};

  const base = Math.floor(amountMinor / n);
  const remainder = amountMinor - base * n;
  const result: Record<string, number> = {};
  participantIds.forEach((id, index) => {
    result[id] = base + (index < remainder ? 1 : 0);
  });
  return result;
}

export function sumShares(shares: Record<string, number>): number {
  return Object.values(shares).reduce((sum, value) => sum + value, 0);
}

/**
 * BR-04. Инвариант расхода: сумма долей строго равна сумме расхода.
 * Используется для деления точными суммами (EXP-04) — остаток показывается
 * пользователю, сохранение блокируется, пока remainder !== 0.
 */
export function checkExactSplit(
  amountMinor: number,
  shares: Record<string, number>,
): { balanced: boolean; remainder: number } {
  const remainder = amountMinor - sumShares(shares);
  return { balanced: remainder === 0, remainder };
}
