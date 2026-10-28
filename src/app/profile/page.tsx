import { AppHeader } from "@/components/nav/app-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentDemoMember } from "@/mocks/demo-trip";

export default function ProfilePage() {
  const user = getCurrentDemoMember();

  return (
    <>
      <AppHeader />
      <div className="mx-auto flex max-w-md flex-col gap-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">Профиль</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Аккаунт</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">{user.initials}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" data-testid="upload-avatar">
                Загрузить аватар
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">Отображаемое имя</Label>
              <Input id="profile-name" defaultValue={user.displayName} data-testid="profile-name" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value="aidos@example.com" disabled data-testid="profile-email" />
            </div>

            <div className="flex justify-end">
              <Button data-testid="save-profile">Сохранить</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
