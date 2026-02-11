import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { SignOutButton } from "@/components/layout/signout-button";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage() {
  const { user } = await requireUser();
  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card className="mt-4">
        <p className="text-sm text-muted">Signed in as {user.email}</p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </Card>
    </AppShell>
  );
}
