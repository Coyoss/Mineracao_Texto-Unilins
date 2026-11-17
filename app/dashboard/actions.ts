"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function openLesson(id: string) {
  const db = await createClient();
  const { error } = await db.rpc("textolab_access", { p_lesson: id });
  if (error) redirect("/dashboard?tab=estudos&status=error");
  redirect("/dashboard?tab=conteudos&aula=" + encodeURIComponent(id));
}

export async function completeLesson(id: string, form: FormData) {
  const db = await createClient();
  const { data, error } = await db.rpc("textolab_complete", {
    p_lesson: id, p_answer: Number(form.get("answer"))
  });
  const status = error ? "error" : String(data);
  redirect("/dashboard?tab=conteudos&aula=" + encodeURIComponent(id) + "&status=" + encodeURIComponent(status));
}

export async function saveProfile(form: FormData) {
  const db = await createClient();
  const { error } = await db.rpc("textolab_profile", {
    p_nickname: String(form.get("nickname") ?? ""), p_listed: form.has("listed")
  });
  redirect("/dashboard?tab=perfil&status=" + (error ? "error" : "saved"));
}
