"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveWeeklyPlan(formData: FormData) {
  const supabase = createClient();
  const week_start = String(formData.get("week_start"));

  await supabase.from("weekly_plans").upsert(
    {
      week_start,
      deliverable: String(formData.get("deliverable") || ""),
      outreach_target_1: String(formData.get("outreach_target_1") || "") || null,
      outreach_target_2: String(formData.get("outreach_target_2") || "") || null,
      ship_target: Number(formData.get("ship_target") || 1),
      network_target: Number(formData.get("network_target") || 2),
      create_target: Number(formData.get("create_target") || 3),
    },
    { onConflict: "user_id,week_start" },
  );

  revalidatePath("/weekly");
}

export async function assignTaskToWeek(formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("tasks")
    .update({ week_start: String(formData.get("week_start")) || null })
    .eq("id", String(formData.get("id")));

  revalidatePath("/weekly");
}
