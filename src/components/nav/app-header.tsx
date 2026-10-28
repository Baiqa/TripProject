import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentDemoMember } from "@/mocks/demo-trip";

export function AppHeader() {
  const currentUser = getCurrentDemoMember();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:px-6">
      <Link href="/trips" className="text-lg font-semibold">
        TripProject
      </Link>
      <Link href="/profile" data-testid="nav-profile">
        <Avatar className="size-8">
          <AvatarFallback>{currentUser.initials}</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
}
