import Link from "next/link";
import { AppHeader } from "@/components/nav/app-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = ["KZT", "USD", "EUR", "RUB", "TRY", "GEL", "UZS", "KGS", "CNY", "AED"];

export default function NewTripPage() {
  return (
    <>
      <AppHeader />
      <div className="mx-auto flex max-w-lg flex-col gap-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">Новая поездка</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Основные параметры</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Название</Label>
              <Input id="title" placeholder="Например, Турция 2026" maxLength={100} data-testid="trip-title" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Необязательно, до 1000 символов"
                maxLength={1000}
                data-testid="trip-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="startDate">Дата начала</Label>
                <Input id="startDate" type="date" data-testid="trip-start-date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="endDate">Дата окончания</Label>
                <Input id="endDate" type="date" data-testid="trip-end-date" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="currency">Базовая валюта</Label>
              <Select defaultValue="KZT">
                <SelectTrigger id="currency" data-testid="trip-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Нельзя изменить после добавления первого расхода (BR-08)
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Link href="/trips" className={buttonVariants({ variant: "outline" })}>
                Отмена
              </Link>
              <Button data-testid="create-trip-submit">Создать поездку</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
