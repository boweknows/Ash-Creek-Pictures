"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signInWithMagicLink, signInWithPassword } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Working..." : label}
    </Button>
  );
}

export function LoginForm() {
  const [magicState, magicAction] = useFormState(signInWithMagicLink as any, null);
  const [passwordState, passwordAction] = useFormState(signInWithPassword as any, null);

  return (
    <div className="mt-6 space-y-4">
      <form action={magicAction} className="space-y-3">
        <Input name="email" type="email" placeholder="you@example.com" required />
        <Submit label="Send magic link" />
        {magicState?.error && <p className="text-sm text-rose-400">{magicState.error}</p>}
        {magicState?.success && <p className="text-sm text-accent">{magicState.success}</p>}
      </form>

      <div className="relative py-2 text-center text-xs text-muted before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-slate-700">
        <span className="relative bg-panel px-2">or</span>
      </div>

      <form action={passwordAction} className="space-y-3">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Submit label="Sign in with password" />
        {passwordState?.error && <p className="text-sm text-rose-400">{passwordState.error}</p>}
      </form>
    </div>
  );
}
