import Link from "next/link";
import { AppHeader } from "@/components/nav/app-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_TRIP_LIST, type DemoTripSummary } from "@/mocks/demo-trip";
import { formatDemoDate, formatDemoMoney } from "@/mocks/format-demo-money";

const GROUPS: { status: DemoTripSummary["status"]; title: string }[] = [
  { status: "current", title: "Текущие" },
  { status: "upcoming", title: "Предстоящие" },
  { status: "past", title: "Прошедшие" },
];

function TripCard({ trip }: { trip: DemoTripSummary }) {
  const balancePositive = trip.personalBalanceMinor >= 0;

  return (
    <Link href={`/trips/${trip.id}`} data-testid={`trip-card-${trip.id}`}>
      <Card className="transition-colors hover:bg-secondary/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-base">
            {trip.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {formatDemoDate(trip.startDate)} – {formatDemoDate(trip.endDate)} · {trip.memberCount} участников
          </span>
          {trip.personalBalanceMinor !== 0 && (
            <Badge variant={balancePositive ? "default" : "destructive"}>
              {balancePositive ? "+" : ""}
              {formatDemoMoney(trip.personalBalanceMinor, trip.currency)}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function TripsPage() {
  return (
    <>
      <AppHeader />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Мои поездки</h1>
          <Link href="/trips/new" data-testid="new-trip-button" className={buttonVariants({})}>
            Новая поездка
          </Link>
        </div>

        {GROUPS.map((group) => {
          const trips = DEMO_TRIP_LIST.filter((t) => t.status === group.status);
          if (trips.length === 0) return null;

          return (
            <section key={group.status} className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">{group.title}</h2>
              <div className="flex flex-col gap-3">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
