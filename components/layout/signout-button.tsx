"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action="/api/auth/signout"
      method="post"
      onSubmit={() => setLoading(true)}
      className="inline"
    >
      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </form>
  );
}
