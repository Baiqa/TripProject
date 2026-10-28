import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_MEMBERS, DEMO_TRIP } from "@/mocks/demo-trip";
import { formatDemoDate } from "@/mocks/format-demo-money";

export default async function InvitePage({
  params,
}: PageProps<"/invite/[token]">) {
  await params;
  const organizer = DEMO_MEMBERS.find((m) => m.role === "organizer")!;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{DEMO_TRIP.title}</CardTitle>
          <CardDescription>
            {formatDemoDate(DEMO_TRIP.startDate)} – {formatDemoDate(DEMO_TRIP.endDate)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{DEMO_TRIP.description}</p>

          <div className="flex items-center gap-2 text-sm">
            <Avatar className="size-6">
              <AvatarFallback className="text-xs">{organizer.initials}</AvatarFallback>
            </Avatar>
            <span>Организатор: {organizer.displayName}</span>
          </div>
          <p className="text-sm text-muted-foreground">Уже {DEMO_MEMBERS.length} участников</p>

          <Button className="w-full" data-testid="join-trip-button">
            Присоединиться
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Если вы не авторизованы, сначала будет предложено войти или зарегистрироваться —
            после этого вы вернётесь на эту страницу (MEM-02).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
