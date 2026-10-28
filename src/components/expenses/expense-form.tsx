"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEMO_MEMBERS,
  DEMO_SEGMENTS,
  DEMO_TRIP,
  type DemoExpense,
  type DemoExpenseCategory,
} from "@/mocks/demo-trip";
import { formatDemoMoney } from "@/mocks/format-demo-money";

const CATEGORY_LABEL: Record<DemoExpenseCategory, string> = {
  accommodation: "Проживание",
  transport: "Транспорт",
  food: "Еда",
  activities: "Развлечения",
  shopping: "Покупки",
  other: "Прочее",
};

const PAYER_ITEMS = Object.fromEntries(DEMO_MEMBERS.map((m) => [m.id, m.displayName]));
const SEGMENT_ITEMS = {
  none: "Без сегмента",
  ...Object.fromEntries(DEMO_SEGMENTS.map((s) => [s.id, s.title])),
};

/**
 * Предпросмотр деления поровну — только для интерактивности макета.
 * Настоящий расчёт (и его тесты) — src/lib/money на этапе 2, по BR-02.
 */
function previewEqualSplit(totalMinor: number, participantIds: string[]): Record<string, number> {
  const n = participantIds.length;
  if (n === 0) return {};
  const base = Math.floor(totalMinor / n);
  const remainder = totalMinor - base * n;
  const result: Record<string, number> = {};
  participantIds.forEach((id, index) => {
    result[id] = base + (index < remainder ? 1 : 0);
  });
  return result;
}

export function ExpenseForm({ initialExpense }: { initialExpense?: DemoExpense }) {
  const [title, setTitle] = useState(initialExpense?.title ?? "");
  const [amountInput, setAmountInput] = useState(
    initialExpense ? (initialExpense.amountOriginalMinor / 100).toFixed(2) : "",
  );
  const [segmentId, setSegmentId] = useState<string>(initialExpense?.segmentId ?? "none");
  const [splitType, setSplitType] = useState<"equal" | "exact">(initialExpense?.splitType ?? "equal");

  const segmentMemberIds = useMemo(() => {
    const segment = DEMO_SEGMENTS.find((s) => s.id === segmentId);
    return segment ? segment.memberIds : DEMO_MEMBERS.map((m) => m.id);
  }, [segmentId]);

  const [participantIds, setParticipantIds] = useState<string[]>(
    initialExpense?.splits.map((s) => s.memberId) ?? segmentMemberIds,
  );

  const [exactShares, setExactShares] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    initialExpense?.splits.forEach((s) => {
      initial[s.memberId] = (s.shareMinor / 100).toFixed(2);
    });
    return initial;
  });

  const totalMinor = Math.round(parseFloat(amountInput || "0") * 100) || 0;
  const equalPreview = previewEqualSplit(totalMinor, participantIds);
  const exactSum = participantIds.reduce(
    (sum, id) => sum + Math.round(parseFloat(exactShares[id] || "0") * 100),
    0,
  );
  const remainder = totalMinor - exactSum;

  function toggleParticipant(id: string) {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  const canSave = totalMinor > 0 && participantIds.length > 0 && (splitType === "equal" || remainder === 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {initialExpense ? "Изменить расход" : "Новый расход"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="expense-title">Название</Label>
          <Input
            id="expense-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, Ужин в Стамбуле"
            data-testid="expense-title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-amount">Сумма ({DEMO_TRIP.baseCurrency})</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0"
              step="0.01"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              data-testid="expense-amount"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-date">Дата</Label>
            <Input
              id="expense-date"
              type="date"
              defaultValue={initialExpense?.expenseDate}
              data-testid="expense-date"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-payer">Плательщик</Label>
            <Select defaultValue={initialExpense?.payerId ?? "aidos"} items={PAYER_ITEMS}>
              <SelectTrigger id="expense-payer" data-testid="expense-payer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEMO_MEMBERS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-category">Категория</Label>
            <Select defaultValue={initialExpense?.category ?? "other"} items={CATEGORY_LABEL}>
              <SelectTrigger id="expense-category" data-testid="expense-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="expense-segment">Сегмент (необязательно)</Label>
          <Select
            value={segmentId}
            items={SEGMENT_ITEMS}
            onValueChange={(value) => {
              setSegmentId(value ?? "none");
              const nextMembers =
                value === "none"
                  ? DEMO_MEMBERS.map((m) => m.id)
                  : DEMO_SEGMENTS.find((s) => s.id === value)?.memberIds ?? [];
              setParticipantIds(nextMembers);
            }}
          >
            <SelectTrigger id="expense-segment" data-testid="expense-segment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без сегмента</SelectItem>
              {DEMO_SEGMENTS.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Участники расхода</Label>
          <div className="flex flex-col gap-2 rounded-md border p-3">
            {DEMO_MEMBERS.map((member) => (
              <label key={member.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={participantIds.includes(member.id)}
                  onCheckedChange={() => toggleParticipant(member.id)}
                  data-testid={`expense-participant-${member.id}`}
                />
                {member.displayName}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Деление</Label>
          <Tabs value={splitType} onValueChange={(v) => setSplitType(v as "equal" | "exact")}>
            <TabsList>
              <TabsTrigger value="equal" data-testid="split-equal-tab">
                Поровну
              </TabsTrigger>
              <TabsTrigger value="exact" data-testid="split-exact-tab">
                Точными суммами
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {splitType === "equal" ? (
            <div className="flex flex-col divide-y rounded-md border text-sm">
              {participantIds.map((id) => {
                const member = DEMO_MEMBERS.find((m) => m.id === id)!;
                return (
                  <div key={id} className="flex justify-between px-3 py-2">
                    <span>{member.displayName}</span>
                    <span className="font-medium">
                      {formatDemoMoney(equalPreview[id] ?? 0, DEMO_TRIP.baseCurrency)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {participantIds.map((id) => {
                const member = DEMO_MEMBERS.find((m) => m.id === id)!;
                return (
                  <div key={id} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{member.displayName}</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32"
                      value={exactShares[id] ?? ""}
                      onChange={(e) =>
                        setExactShares((prev) => ({ ...prev, [id]: e.target.value }))
                      }
                      data-testid={`expense-exact-share-${id}`}
                    />
                  </div>
                );
              })}
              <p
                className={`text-sm ${remainder === 0 ? "text-muted-foreground" : "text-destructive"}`}
                data-testid="split-remainder"
              >
                {remainder === 0
                  ? "Сумма долей сходится с суммой расхода"
                  : `Не распределено: ${formatDemoMoney(remainder, DEMO_TRIP.baseCurrency)}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href={`/trips/${DEMO_TRIP.id}/expenses`} className={buttonVariants({ variant: "outline" })}>
            Отмена
          </Link>
          <Button disabled={!canSave} data-testid="expense-submit">
            Сохранить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
