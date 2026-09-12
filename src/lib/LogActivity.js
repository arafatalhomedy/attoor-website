import { supabase } from "./supabaseClient";

// action: "created" | "updated" | "deleted"
// contentType: "project" | "team" | "service"
export async function logActivity(action, contentType, labelEn, labelAr) {
  const { error } = await supabase.from("activity_log").insert([
    {
      action,
      content_type: contentType,
      label_en: labelEn || null,
      label_ar: labelAr || null,
    },
  ]);

  // Never let a logging failure block the actual save/delete the admin cares about —
  // just warn in the console so it doesn't go silently unnoticed either.
  if (error) {
    console.error("Failed to log activity:", error.message);
  }
}
