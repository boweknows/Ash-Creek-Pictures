import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { ensureSupabaseEnv, supabaseAnonKey, supabaseUrl } from "./env";

export function createClient() {
  ensureSupabaseEnv();
  const cookieStore = cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // called from server component in immutable context
        }
      },
    },
  });
}
