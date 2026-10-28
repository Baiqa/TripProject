import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Восстановление пароля</CardTitle>
        <CardDescription>Отправим ссылку для сброса пароля на почту</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" data-testid="reset-email" />
        </div>
        <Button className="w-full" data-testid="reset-submit">
          Отправить ссылку
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Вспомнили пароль?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
