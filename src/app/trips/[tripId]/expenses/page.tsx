import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TripHeader } from "@/components/trips/trip-header";
import {
  DEMO_EXPENSES,
  DEMO_SEGMENTS,
  DEMO_TOTAL_EXPENSES_BASE_MINOR,
  DEMO_TRIP,
  getDemoMember,
  type DemoExpenseCategory,
} from "@/mocks/demo-trip";
import { formatDemoDate, formatDemoMoney } from "@/mocks/format-demo-money";

const CATEGORY_LABEL: Record<DemoExpenseCategory, string> = {
  accommodation: "Проживание",
  transport: "Транспорт",
  food: "Еда",
  activities: "Развлечения",
  shopping: "Покупки",
  other: "Прочее",
};

export default function ExpensesPage() {
  const expenses = [...DEMO_EXPENSES].sort((a, b) => a.expenseDate.localeCompare(b.expenseDate));
  const payerIds = [...new Set(DEMO_EXPENSES.map((e) => e.payerId))];

  const categoryItems = { all: "Все категории", ...CATEGORY_LABEL };
  const payerItems = {
    all: "Все плательщики",
    ...Object.fromEntries(payerIds.map((id) => [id, getDemoMember(id).displayName])),
  };
  const segmentItems = {
    all: "Все сегменты",
    ...Object.fromEntries(DEMO_SEGMENTS.map((s) => [s.id, s.title])),
  };

  return (
    <>
      <TripHeader title="Расходы" subtitle={`${expenses.length} расходов`} />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all" items={categoryItems}>
              <SelectTrigger className="w-40" data-testid="filter-category">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="all" items={payerItems}>
              <SelectTrigger className="w-40" data-testid="filter-payer">
                <SelectValue placeholder="Плательщик" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все плательщики</SelectItem>
                {payerIds.map((payerId) => (
                  <SelectItem key={payerId} value={payerId}>
                    {getDemoMember(payerId).displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="all" items={segmentItems}>
              <SelectTrigger className="w-40" data-testid="filter-segment">
                <SelectValue placeholder="Сегмент" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все сегменты</SelectItem>
                {DEMO_SEGMENTS.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Link
            href={`/trips/${DEMO_TRIP.id}/expenses/new`}
            className={buttonVariants({})}
            data-testid="new-expense-button"
          >
            Добавить расход
          </Link>
        </div>

        <div className="flex flex-col divide-y rounded-lg border">
          {expenses.map((expense) => {
            const payer = getDemoMember(expense.payerId);
            const segment = DEMO_SEGMENTS.find((s) => s.id === expense.segmentId);

            return (
              <Link
                key={expense.id}
                href={`/trips/${DEMO_TRIP.id}/expenses/${expense.id}`}
                className="flex items-center justify-between gap-3 p-3 hover:bg-secondary/40"
                data-testid={`expense-row-${expense.id}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">{payer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{expense.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {payer.displayName} · {formatDemoDate(expense.expenseDate)}
                      {segment && ` · ${segment.title}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium">
                    {formatDemoMoney(expense.amountBaseMinor, DEMO_TRIP.baseCurrency)}
                  </span>
                  <Badge variant="outline">{CATEGORY_LABEL[expense.category]}</Badge>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 border-t pt-3 text-sm">
          <span className="text-muted-foreground">Итого:</span>
          <span className="font-semibold" data-testid="expenses-total">
            {formatDemoMoney(DEMO_TOTAL_EXPENSES_BASE_MINOR, DEMO_TRIP.baseCurrency)}
          </span>
        </div>
      </div>
    </>
  );
}
