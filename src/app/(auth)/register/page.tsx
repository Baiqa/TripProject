import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Займёт меньше минуты</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="displayName">Отображаемое имя</Label>
          <Input id="displayName" placeholder="Как вас видят другие участники" data-testid="register-name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" data-testid="register-email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" type="password" placeholder="Минимум 8 символов" data-testid="register-password" />
        </div>
        <Button className="w-full" data-testid="register-submit">
          Создать аккаунт
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
