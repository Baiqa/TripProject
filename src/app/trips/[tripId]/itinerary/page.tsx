import { Badge } from "@/components/ui/badge";
import { TripHeader } from "@/components/trips/trip-header";
import {
  DEMO_ITINERARY_ITEMS,
  DEMO_SEGMENTS,
  DEMO_TRIP,
  type DemoItineraryItemType,
} from "@/mocks/demo-trip";
import { formatDemoDate, formatDemoDateTime } from "@/mocks/format-demo-money";

const ITINERARY_TYPE_LABEL: Record<DemoItineraryItemType, string> = {
  flight: "Перелёт",
  train: "Поезд",
  bus: "Автобус",
  transfer: "Трансфер",
  accommodation: "Проживание",
  activity: "Активность",
  other: "Другое",
};

function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (cursor <= last) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export default function ItineraryPage() {
  const days = enumerateDates(DEMO_TRIP.startDate, DEMO_TRIP.endDate);

  return (
    <>
      <TripHeader title="Маршрут" subtitle="Таймлайн по дням" />

      <div className="flex flex-col gap-6 p-4 md:p-6">
        {days.map((day, index) => {
          const activeSegments = DEMO_SEGMENTS.filter((s) => day >= s.startDate && day <= s.endDate);
          const items = DEMO_ITINERARY_ITEMS.filter((i) => i.startsAt.startsWith(day));

          return (
            <section key={day} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">
                  День {index + 1} · {formatDemoDate(day)}
                </h2>
                {activeSegments.map((segment) => (
                  <Badge key={segment.id} variant="secondary">
                    {segment.title} · {segment.memberIds.length} чел.
                  </Badge>
                ))}
              </div>

              {items.length === 0 ? (
                <p className="pl-1 text-sm text-muted-foreground">Элементов маршрута нет</p>
              ) : (
                <div className="flex flex-col divide-y rounded-lg border">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {ITINERARY_TYPE_LABEL[item.type]} · {item.place}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDemoDateTime(item.startsAt)}
                        {item.endsAt && ` – ${formatDemoDateTime(item.endsAt)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
