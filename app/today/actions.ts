"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleTask(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const supabase = createClient();
  await supabase.from("tasks").update({ status }).eq("id", id);
  revalidatePath("/today");
}

export async function addSprint(formData: FormData) {
  const duration = Number(formData.get("duration"));
  const notes = String(formData.get("notes") || "");
  const supabase = createClient();
  await supabase.from("sprints").insert({ duration_minutes: duration, notes, started_at: new Date().toISOString() });
  revalidatePath("/today");
}

export async function saveCheckin(formData: FormData) {
  const supabase = createClient();
  const date = new Date().toISOString().split("T")[0];

  await supabase.from("daily_checkins").upsert(
    {
      date,
      shipped_text: String(formData.get("shipped_text") || ""),
      blocked_text: String(formData.get("blocked_text") || ""),
      tomorrow_first_move: String(formData.get("tomorrow_first_move") || ""),
    },
    { onConflict: "user_id,date" },
  );
  revalidatePath("/today");
}
