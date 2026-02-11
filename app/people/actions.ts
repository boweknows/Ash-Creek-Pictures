"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveContact(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || ""),
    org: String(formData.get("org") || "") || null,
    role: String(formData.get("role") || "") || null,
    email: String(formData.get("email") || "") || null,
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    last_contacted_at: String(formData.get("last_contacted_at") || "") || null,
    next_followup_at: String(formData.get("next_followup_at") || "") || null,
    notes: String(formData.get("notes") || "") || null,
  };

  if (id) await supabase.from("contacts").update(payload).eq("id", id);
  else await supabase.from("contacts").insert(payload);

  revalidatePath("/people");
}
