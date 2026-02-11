"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ensureSupabaseEnv, supabaseAnonKey, supabaseUrl } from "./env";

let supabaseSingleton: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  ensureSupabaseEnv();

  if (!supabaseSingleton) {
    supabaseSingleton = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
  }

  return supabaseSingleton;
}
