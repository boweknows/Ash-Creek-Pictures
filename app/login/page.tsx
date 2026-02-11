import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./ui";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect("/today");

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-panel p-6">
        <h1 className="text-2xl font-semibold">Ash Creek Career OS</h1>
        <p className="mt-2 text-sm text-muted">Sign in to start your daily command center.</p>
        <LoginForm />
      </div>
    </main>
  );
}
