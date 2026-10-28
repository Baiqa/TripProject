import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TripHeader } from "@/components/trips/trip-header";
import { DEMO_MEMBERS, DEMO_TRIP, getDemoBalance, type DemoMember } from "@/mocks/demo-trip";
import { formatDemoMoney } from "@/mocks/format-demo-money";
import { MoreVertical } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  organizer: "Организатор",
  member: "Участник",
  observer: "Наблюдатель",
};

function MemberActions({ member }: { member: DemoMember }) {
  if (member.role === "organizer") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Действия с участником" />}
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Сделать наблюдателем</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Исключить из поездки</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MembersPage() {
  return (
    <>
      <TripHeader title="Участники" subtitle={`${DEMO_MEMBERS.length} человек`} />

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex justify-end">
          <Button data-testid="create-invite-button">Создать приглашение</Button>
        </div>

        {/* Мобильные — карточки, таблица на такой ширине не помещается без горизонтальной прокрутки */}
        <div className="flex flex-col divide-y rounded-lg border sm:hidden">
          {DEMO_MEMBERS.map((member) => {
            const balance = getDemoBalance(member.id);
            return (
              <div key={member.id} className="flex items-center gap-3 p-3" data-testid={`member-row-${member.id}`}>
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{member.displayName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === "organizer" ? "default" : "secondary"}>
                      {ROLE_LABEL[member.role]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {member.status === "active" ? "Активен" : "Покинул"}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm font-medium ${balance >= 0 ? "text-emerald-600" : "text-destructive"}`}
                >
                  {balance >= 0 ? "+" : ""}
                  {formatDemoMoney(balance, DEMO_TRIP.baseCurrency)}
                </span>
                <MemberActions member={member} />
              </div>
            );
          })}
        </div>

        {/* Планшет и десктоп — таблица */}
        <div className="hidden rounded-lg border sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Участник</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Баланс</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_MEMBERS.map((member) => {
                const balance = getDemoBalance(member.id);
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                        {member.displayName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === "organizer" ? "default" : "secondary"}>
                        {ROLE_LABEL[member.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className={balance >= 0 ? "text-emerald-600" : "text-destructive"}>
                      {balance >= 0 ? "+" : ""}
                      {formatDemoMoney(balance, DEMO_TRIP.baseCurrency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.status === "active" ? "Активен" : "Покинул"}
                    </TableCell>
                    <TableCell>
                      <MemberActions member={member} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground">
          Выход и исключение возможны только при нулевом балансе (BR-09).
        </p>
      </div>
    </>
  );
}
