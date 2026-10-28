"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Receipt,
  Scale,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "", label: "Обзор", icon: LayoutDashboard, mobile: true },
  { href: "/itinerary", label: "Маршрут", icon: Map, mobile: true },
  { href: "/expenses", label: "Расходы", icon: Receipt, mobile: true },
  { href: "/balances", label: "Балансы", icon: Scale, mobile: true },
  { href: "/members", label: "Участники", icon: Users, mobile: false },
  { href: "/settings", label: "Настройки", icon: Settings, mobile: false },
] as const;

function isActive(pathname: string, tripBase: string, href: string) {
  const target = `${tripBase}${href}`;
  return href === "" ? pathname === target : pathname.startsWith(target);
}

export function TripNav({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const tripBase = `/trips/${tripId}`;

  return (
    <>
      {/* Десктоп — боковое меню */}
      <nav className="hidden w-56 shrink-0 flex-col gap-1 border-r p-4 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={`${tripBase}${item.href}`}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, tripBase, item.href)
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Мобильные — нижняя панель */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t bg-background md:hidden">
        {NAV_ITEMS.filter((item) => item.mobile).map((item) => (
          <Link
            key={item.href}
            href={`${tripBase}${item.href}`}
            data-testid={`nav-${item.href === "" ? "overview" : item.href.slice(1)}`}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium",
              isActive(pathname, tripBase, item.href)
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
