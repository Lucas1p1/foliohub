"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveTemplateAction(userId: string, templateId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ template_id: templateId })
    .eq("id", userId);
  
  if (error) {
    console.error("Save template error:", error);
    throw new Error(error.message);
  }
  revalidatePath("/[username]", "page");
  revalidatePath("/dashboard/settings");
}