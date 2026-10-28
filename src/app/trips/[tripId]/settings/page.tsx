import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TripHeader } from "@/components/trips/trip-header";
import { DEMO_TRIP } from "@/mocks/demo-trip";

export default function TripSettingsPage() {
  return (
    <>
      <TripHeader title="Настройки поездки" />

      <div className="mx-auto flex max-w-lg flex-col gap-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Параметры</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-title">Название</Label>
              <Input id="settings-title" defaultValue={DEMO_TRIP.title} maxLength={100} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-description">Описание</Label>
              <Textarea id="settings-description" defaultValue={DEMO_TRIP.description} maxLength={1000} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-start">Дата начала</Label>
                <Input id="settings-start" type="date" defaultValue={DEMO_TRIP.startDate} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-end">Дата окончания</Label>
                <Input id="settings-end" type="date" defaultValue={DEMO_TRIP.endDate} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-currency">Базовая валюта</Label>
              <Input id="settings-currency" value={DEMO_TRIP.baseCurrency} disabled />
              <p className="text-xs text-muted-foreground">
                Нельзя изменить — по поездке уже есть расходы (BR-08)
              </p>
            </div>
            <div className="flex justify-end">
              <Button data-testid="save-settings">Сохранить</Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Опасная зона</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger render={<Button variant="destructive" data-testid="delete-trip-button" />}>
                Удалить поездку
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Удалить поездку «{DEMO_TRIP.title}»?</DialogTitle>
                  <DialogDescription>
                    Удалятся все связанные данные: маршрут, расходы, переводы и приглашения.
                    Отменить это действие будет нельзя.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" data-testid="confirm-delete-trip">
                    Удалить безвозвратно
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
