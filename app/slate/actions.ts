"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveProject(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || ""),
    type: String(formData.get("type") || "doc"),
    status: String(formData.get("status") || "active"),
    priority: Number(formData.get("priority") || 2),
    next_action: String(formData.get("next_action") || ""),
    due_date: String(formData.get("due_date") || "") || null,
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    archived: formData.get("archived") === "on",
  };

  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }

  revalidatePath("/slate");
}

export async function archiveProject(formData: FormData) {
  const supabase = createClient();
  await supabase.from("projects").update({ archived: true }).eq("id", String(formData.get("id")));
  revalidatePath("/slate");
}
