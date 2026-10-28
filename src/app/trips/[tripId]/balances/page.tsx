import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripHeader } from "@/components/trips/trip-header";
import {
  DEMO_BALANCES,
  DEMO_RECOMMENDED_TRANSFERS,
  DEMO_TRIP,
  getDemoMember,
} from "@/mocks/demo-trip";
import { formatDemoMoney } from "@/mocks/format-demo-money";

const CURRENT_USER_ID = "aidos";

export default function BalancesPage() {
  const myBalance = DEMO_BALANCES.find((b) => b.memberId === CURRENT_USER_ID)!.balanceMinor;
  const iOwe = DEMO_RECOMMENDED_TRANSFERS.filter((t) => t.fromMemberId === CURRENT_USER_ID);
  const owedToMe = DEMO_RECOMMENDED_TRANSFERS.filter((t) => t.toMemberId === CURRENT_USER_ID);

  return (
    <>
      <TripHeader title="Балансы" />

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Вы должны</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {iOwe.length === 0 ? (
                <p className="text-sm text-muted-foreground">Никому не должны</p>
              ) : (
                iOwe.map((t, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{getDemoMember(t.toMemberId).displayName}</span>
                    <span className="font-medium text-destructive">
                      {formatDemoMoney(t.amountMinor, DEMO_TRIP.baseCurrency)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Вам должны</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {owedToMe.length === 0 ? (
                <p className="text-sm text-muted-foreground">Вам никто не должен</p>
              ) : (
                owedToMe.map((t, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{getDemoMember(t.fromMemberId).displayName}</span>
                    <span className="font-medium text-emerald-600">
                      {formatDemoMoney(t.amountMinor, DEMO_TRIP.baseCurrency)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Балансы участников</h2>
          <div className="flex flex-col divide-y rounded-lg border">
            {DEMO_BALANCES.map((b) => {
              const member = getDemoMember(b.memberId);
              const positive = b.balanceMinor >= 0;
              return (
                <div key={b.memberId} className="flex items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.displayName}</span>
                    {member.id === CURRENT_USER_ID && (
                      <span className="text-xs text-muted-foreground">(вы)</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${positive ? "text-emerald-600" : "text-destructive"}`}>
                    {positive ? "+" : ""}
                    {formatDemoMoney(b.balanceMinor, DEMO_TRIP.baseCurrency)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Сумма балансов всех участников равна нулю (BR-05): {myBalance >= 0 ? "+" : ""}
            {formatDemoMoney(myBalance, DEMO_TRIP.baseCurrency)} — ваш текущий баланс.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Рекомендованные переводы</h2>
          <div className="flex flex-col divide-y rounded-lg border">
            {DEMO_RECOMMENDED_TRANSFERS.map((t, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm">
                  {getDemoMember(t.fromMemberId).displayName} → {getDemoMember(t.toMemberId).displayName}
                </span>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-sm font-medium">
                    {formatDemoMoney(t.amountMinor, DEMO_TRIP.baseCurrency)}
                  </span>
                  <Button size="sm" variant="outline" data-testid={`mark-settled-${i}`}>
                    Отметить выполненным
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Link href={`/trips/${DEMO_TRIP.id}/expenses`} className="text-sm text-primary hover:underline">
          Смотреть все расходы
        </Link>
      </div>
    </>
  );
}
