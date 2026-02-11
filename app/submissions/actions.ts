"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveSubmission(formData: FormData) {
  const supabase = createClient();
  const payload = {
    film_title: String(formData.get("film_title") || "Alpha Station"),
    festival_name: String(formData.get("festival_name") || ""),
    deadline: String(formData.get("deadline") || "") || null,
    status: String(formData.get("status") || "planned"),
    submission_fee: Number(formData.get("submission_fee") || 0) || null,
    submission_date: String(formData.get("submission_date") || "") || null,
    notes: String(formData.get("notes") || "") || null,
    filmfreeway_link: String(formData.get("filmfreeway_link") || "") || null,
  };

  await supabase.from("submissions").insert(payload);
  revalidatePath("/submissions");
}
