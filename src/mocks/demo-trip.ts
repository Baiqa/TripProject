/**
 * Мок-данные для макетов экранов (см. docs/mockups.md).
 * НЕ является реальным источником данных — на этапах 1–3 страницы,
 * которые сейчас импортируют этот файл, переключаются на запросы к
 * Supabase (Server Components + TanStack Query) и RPC `create_expense`/
 * `update_expense`. Ничего отсюда не должно попасть в lib/money или в
 * реальную бизнес-логику.
 *
 * Сценарий — демонстрационный кейс из раздела 14 ТЗ: Айдос, Дана, Ерлан
 * и Мадина едут в Турцию на 8 дней, базовая валюта KZT. Все денежные
 * примеры ниже посчитаны вручную и соответствуют бизнес-правилам ТЗ:
 * BR-02 (деление поровну с остатком), BR-04 (инвариант суммы долей),
 * BR-05 (баланс = оплачено − доли), BR-06 (упрощение долгов, ≤ n−1 переводов).
 */

export type DemoRole = "organizer" | "member" | "observer";
export type DemoMemberStatus = "active" | "left";

export interface DemoMember {
  id: string;
  displayName: string;
  initials: string;
  role: DemoRole;
  status: DemoMemberStatus;
  joinedAt: string;
}

export interface DemoSegment {
  id: string;
  title: string;
  place: string;
  startDate: string;
  endDate: string;
  memberIds: string[];
}

export type DemoItineraryItemType =
  | "flight"
  | "train"
  | "bus"
  | "transfer"
  | "accommodation"
  | "activity"
  | "other";

export interface DemoItineraryItem {
  id: string;
  segmentId: string;
  type: DemoItineraryItemType;
  title: string;
  startsAt: string;
  endsAt?: string;
  place: string;
  plannedCostMinor?: number;
}

export type DemoExpenseCategory =
  | "accommodation"
  | "transport"
  | "food"
  | "activities"
  | "shopping"
  | "other";

export interface DemoExpenseSplit {
  memberId: string;
  shareMinor: number;
}

export interface DemoExpense {
  id: string;
  title: string;
  category: DemoExpenseCategory;
  expenseDate: string;
  payerId: string;
  segmentId: string | null;
  currency: "KZT" | "USD" | "TRY";
  amountOriginalMinor: number;
  rateToBase: number;
  amountBaseMinor: number;
  splitType: "equal" | "exact";
  splits: DemoExpenseSplit[];
}

export interface DemoBalance {
  memberId: string;
  balanceMinor: number;
}

export interface DemoTransfer {
  fromMemberId: string;
  toMemberId: string;
  amountMinor: number;
}

export const DEMO_TRIP = {
  id: "turkey-2026",
  title: "Турция 2026",
  description: "Стамбул, Каппадокия и Анталья — 8 дней вчетвером (и не только).",
  startDate: "2026-10-12",
  endDate: "2026-10-19",
  baseCurrency: "KZT" as const,
  createdBy: "aidos",
};

// Порядок в массиве = порядок вступления в поездку (важно для BR-02/BR-03:
// остаток при делении поровну распределяется по порядку вступления).
export const DEMO_MEMBERS: DemoMember[] = [
  { id: "aidos", displayName: "Айдос Нурланов", initials: "АН", role: "organizer", status: "active", joinedAt: "2026-09-01" },
  { id: "dana", displayName: "Дана Сатпаева", initials: "ДС", role: "member", status: "active", joinedAt: "2026-09-02" },
  { id: "erlan", displayName: "Ерлан Жумабеков", initials: "ЕЖ", role: "member", status: "active", joinedAt: "2026-09-03" },
  { id: "madina", displayName: "Мадина Ахметова", initials: "МА", role: "member", status: "active", joinedAt: "2026-09-03" },
];

export const DEMO_SEGMENTS: DemoSegment[] = [
  {
    id: "istanbul",
    title: "Стамбул",
    place: "Стамбул, Турция",
    startDate: "2026-10-12",
    endDate: "2026-10-15",
    memberIds: ["aidos", "dana", "erlan", "madina"],
  },
  {
    id: "cappadocia",
    title: "Каппадокия",
    place: "Гёреме, Турция",
    startDate: "2026-10-16",
    endDate: "2026-10-19",
    memberIds: ["aidos", "dana", "erlan"],
  },
  {
    id: "antalya",
    title: "Анталья",
    place: "Анталья, Турция",
    startDate: "2026-10-16",
    endDate: "2026-10-19",
    memberIds: ["madina"],
  },
];

export const DEMO_ITINERARY_ITEMS: DemoItineraryItem[] = [
  {
    id: "item-flight",
    segmentId: "istanbul",
    type: "flight",
    title: "Перелёт Алматы — Стамбул",
    startsAt: "2026-10-12T08:00",
    endsAt: "2026-10-12T13:10",
    place: "Аэропорт Алматы → Аэропорт им. Ататюрка",
    plannedCostMinor: 20_000_000,
  },
  {
    id: "item-hotel",
    segmentId: "istanbul",
    type: "accommodation",
    title: "Отель в Стамбуле",
    startsAt: "2026-10-12T15:00",
    endsAt: "2026-10-15T12:00",
    place: "Султанахмет, Стамбул",
    plannedCostMinor: 37_600_000,
  },
  {
    id: "item-balloon",
    segmentId: "cappadocia",
    type: "activity",
    title: "Полёт на воздушном шаре",
    startsAt: "2026-10-17T05:30",
    endsAt: "2026-10-17T07:30",
    place: "Гёреме, Каппадокия",
    plannedCostMinor: 4_050_000,
  },
  {
    id: "item-antalya-hotel",
    segmentId: "antalya",
    type: "accommodation",
    title: "Отель в Анталье",
    startsAt: "2026-10-16T14:00",
    endsAt: "2026-10-19T11:00",
    place: "Лара, Анталья",
  },
];

/**
 * amountBaseMinor всегда в тиын (минимальная единица KZT — базовой валюты
 * поездки). Для расходов в USD/TRY указаны исходная сумма и курс на дату
 * расхода (BR-07); дальнейшие изменения курсов на эти расходы не влияют.
 */
export const DEMO_EXPENSES: DemoExpense[] = [
  {
    id: "exp-flight",
    title: "Перелёт Алматы — Стамбул",
    category: "transport",
    expenseDate: "2026-10-12",
    payerId: "aidos",
    segmentId: "istanbul",
    currency: "KZT",
    amountOriginalMinor: 20_000_000,
    rateToBase: 1,
    amountBaseMinor: 20_000_000,
    splitType: "equal",
    splits: [
      { memberId: "aidos", shareMinor: 5_000_000 },
      { memberId: "dana", shareMinor: 5_000_000 },
      { memberId: "erlan", shareMinor: 5_000_000 },
      { memberId: "madina", shareMinor: 5_000_000 },
    ],
  },
  {
    id: "exp-hotel",
    title: "Отель в Стамбуле",
    category: "accommodation",
    expenseDate: "2026-10-12",
    payerId: "dana",
    segmentId: "istanbul",
    currency: "USD",
    amountOriginalMinor: 80_000, // 800.00 USD
    rateToBase: 470, // 1 USD = 470 KZT на дату расхода
    amountBaseMinor: 37_600_000, // 800 × 470 = 376 000 KZT
    splitType: "equal",
    splits: [
      { memberId: "aidos", shareMinor: 9_400_000 },
      { memberId: "dana", shareMinor: 9_400_000 },
      { memberId: "erlan", shareMinor: 9_400_000 },
      { memberId: "madina", shareMinor: 9_400_000 },
    ],
  },
  {
    id: "exp-dinner",
    title: "Ужин в Стамбуле",
    category: "food",
    expenseDate: "2026-10-13",
    payerId: "madina",
    segmentId: "istanbul",
    currency: "KZT",
    amountOriginalMinor: 2_400_000, // 24 000 KZT
    rateToBase: 1,
    amountBaseMinor: 2_400_000,
    // EXP-04: точное деление — Мадина заказала больше остальных.
    splitType: "exact",
    splits: [
      { memberId: "aidos", shareMinor: 500_000 },
      { memberId: "dana", shareMinor: 500_000 },
      { memberId: "erlan", shareMinor: 500_000 },
      { memberId: "madina", shareMinor: 900_000 },
    ],
  },
  {
    id: "exp-balloon",
    title: "Полёт на воздушном шаре",
    category: "activities",
    expenseDate: "2026-10-17",
    payerId: "erlan",
    segmentId: "cappadocia",
    currency: "TRY",
    amountOriginalMinor: 300_000, // 3 000.00 TRY
    rateToBase: 13.5, // 1 TRY = 13.5 KZT на дату расхода
    amountBaseMinor: 4_050_000, // 3000 × 13.5 = 40 500 KZT
    splitType: "equal",
    splits: [
      { memberId: "aidos", shareMinor: 1_350_000 },
      { memberId: "dana", shareMinor: 1_350_000 },
      { memberId: "erlan", shareMinor: 1_350_000 },
    ],
  },
  {
    id: "exp-taxi",
    title: "Такси до кемпинга",
    category: "transport",
    expenseDate: "2026-10-16",
    payerId: "aidos",
    segmentId: "cappadocia",
    currency: "KZT",
    amountOriginalMinor: 100_000, // 1000,00 ₸ — пример деления поровну из BR-02
    rateToBase: 1,
    amountBaseMinor: 100_000,
    // BR-02: floor(100000 / 3) = 33333, остаток 1 → первому по порядку
    // вступления (Айдос) достаётся 33 334.
    splitType: "equal",
    splits: [
      { memberId: "aidos", shareMinor: 33_334 },
      { memberId: "dana", shareMinor: 33_333 },
      { memberId: "erlan", shareMinor: 33_333 },
    ],
  },
  {
    id: "exp-antalya-lunch",
    title: "Обед в Анталье",
    category: "food",
    expenseDate: "2026-10-17",
    payerId: "madina",
    segmentId: "antalya",
    currency: "KZT",
    amountOriginalMinor: 800_000, // 8 000 KZT
    rateToBase: 1,
    amountBaseMinor: 800_000,
    splitType: "equal",
    splits: [{ memberId: "madina", shareMinor: 800_000 }],
  },
];

export const DEMO_TOTAL_EXPENSES_BASE_MINOR = DEMO_EXPENSES.reduce(
  (sum, expense) => sum + expense.amountBaseMinor,
  0,
); // 64 950 000 тиын = 649 500 ₸

/**
 * BR-05: баланс = оплачено − доли (переводов в демо-данных ещё нет).
 * Посчитано вручную из DEMO_EXPENSES выше; сумма балансов равна нулю.
 */
export const DEMO_BALANCES: DemoBalance[] = [
  { memberId: "aidos", balanceMinor: 3_816_666 },
  { memberId: "dana", balanceMinor: 21_316_667 },
  { memberId: "erlan", balanceMinor: -12_233_333 },
  { memberId: "madina", balanceMinor: -12_900_000 },
];

/**
 * BAL-02 / BR-06: жадное упрощение долгов по DEMO_BALANCES.
 * 3 перевода при 4 участниках — не больше n − 1, как требует правило.
 */
export const DEMO_RECOMMENDED_TRANSFERS: DemoTransfer[] = [
  { fromMemberId: "madina", toMemberId: "dana", amountMinor: 12_900_000 },
  { fromMemberId: "erlan", toMemberId: "dana", amountMinor: 8_416_667 },
  { fromMemberId: "erlan", toMemberId: "aidos", amountMinor: 3_816_666 },
];

const CURRENT_USER_ID = "aidos";

export interface DemoTripSummary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  memberCount: number;
  personalBalanceMinor: number;
  currency: "KZT";
  status: "upcoming" | "current" | "past";
}

// Для страницы списка поездок (TRIP-02) — помимо основной демо-поездки
// добавлены две вымышленные записи, чтобы показать группировку по статусу.
export const DEMO_TRIP_LIST: DemoTripSummary[] = [
  {
    id: "almaty-weekend",
    title: "Выходные в Алматы",
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    memberCount: 3,
    personalBalanceMinor: 0,
    currency: "KZT",
    status: "upcoming",
  },
  {
    id: DEMO_TRIP.id,
    title: DEMO_TRIP.title,
    startDate: DEMO_TRIP.startDate,
    endDate: DEMO_TRIP.endDate,
    memberCount: DEMO_MEMBERS.length,
    personalBalanceMinor: DEMO_BALANCES.find((b) => b.memberId === "aidos")!.balanceMinor,
    currency: "KZT",
    status: "current",
  },
  {
    id: "tbilisi-2025",
    title: "Тбилиси и Кахетия",
    startDate: "2025-05-01",
    endDate: "2025-05-07",
    memberCount: 5,
    personalBalanceMinor: -12_000,
    currency: "KZT",
    status: "past",
  },
];

export function getDemoMember(id: string): DemoMember {
  const member = DEMO_MEMBERS.find((m) => m.id === id);
  if (!member) throw new Error(`Unknown demo member: ${id}`);
  return member;
}

export function getCurrentDemoMember(): DemoMember {
  return getDemoMember(CURRENT_USER_ID);
}

export function getDemoBalance(memberId: string): number {
  return DEMO_BALANCES.find((b) => b.memberId === memberId)?.balanceMinor ?? 0;
}
