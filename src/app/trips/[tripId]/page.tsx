import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripHeader } from "@/components/trips/trip-header";
import {
  DEMO_ITINERARY_ITEMS,
  DEMO_MEMBERS,
  DEMO_TOTAL_EXPENSES_BASE_MINOR,
  DEMO_TRIP,
  getDemoBalance,
} from "@/mocks/demo-trip";
import { formatDemoDate, formatDemoDateTime, formatDemoMoney } from "@/mocks/format-demo-money";

const ITINERARY_TYPE_LABEL: Record<string, string> = {
  flight: "Перелёт",
  train: "Поезд",
  bus: "Автобус",
  transfer: "Трансфер",
  accommodation: "Проживание",
  activity: "Активность",
  other: "Другое",
};

export default function TripOverviewPage() {
  const personalBalance = getDemoBalance("aidos");
  const upcomingItems = [...DEMO_ITINERARY_ITEMS]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  return (
    <>
      <TripHeader
        title={DEMO_TRIP.title}
        subtitle={`${formatDemoDate(DEMO_TRIP.startDate)} – ${formatDemoDate(DEMO_TRIP.endDate)}`}
      />

      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {DEMO_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1">
              <Avatar className="size-6">
                <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{member.displayName.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Общая сумма расходов
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold" data-testid="trip-total-expenses">
              {formatDemoMoney(DEMO_TOTAL_EXPENSES_BASE_MINOR, DEMO_TRIP.baseCurrency)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Ваш баланс</CardTitle>
            </CardHeader>
            <CardContent
              className={`text-2xl font-semibold ${personalBalance >= 0 ? "text-emerald-600" : "text-destructive"}`}
              data-testid="trip-personal-balance"
            >
              {personalBalance >= 0 ? "+" : ""}
              {formatDemoMoney(personalBalance, DEMO_TRIP.baseCurrency)}
            </CardContent>
          </Card>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">Ближайшие элементы маршрута</h2>
            <Link href={`/trips/${DEMO_TRIP.id}/itinerary`} className="text-sm text-primary hover:underline">
              Весь маршрут
            </Link>
          </div>
          <div className="flex flex-col divide-y rounded-lg border">
            {upcomingItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ITINERARY_TYPE_LABEL[item.type]} · {item.place}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDemoDateTime(item.startsAt)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
