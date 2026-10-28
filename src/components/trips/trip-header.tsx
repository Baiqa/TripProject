import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function TripHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b p-4 md:p-6">
      <Link
        href="/trips"
        className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Мои поездки
      </Link>
      <h1 className="text-xl font-semibold">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
