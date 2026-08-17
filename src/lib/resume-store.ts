import { supabase } from "@/integrations/supabase/client";

export type SavedResume = {
  fileName: string | null;
  content: string;
  updatedAt: string | null;
};

const LOCAL_KEY = "applywise.resume";

function readLocal(): SavedResume | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as SavedResume) : null;
  } catch {
    return null;
  }
}

function writeLocal(resume: SavedResume | null) {
  if (typeof window === "undefined") return;
  try {
    if (resume) window.localStorage.setItem(LOCAL_KEY, JSON.stringify(resume));
    else window.localStorage.removeItem(LOCAL_KEY);
  } catch {
    /* storage unavailable */
  }
}

export async function getResume(userId?: string): Promise<SavedResume | null> {
  if (!userId) return readLocal();
  const { data, error } = await supabase
    .from("user_resumes")
    .select("file_name,content,updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return readLocal();
  const resume: SavedResume = {
    fileName: data.file_name,
    content: data.content,
    updatedAt: data.updated_at,
  };
  writeLocal(resume);
  return resume;
}

export async function saveResume(
  content: string,
  fileName: string | null,
  userId?: string,
): Promise<SavedResume> {
  const resume: SavedResume = { fileName, content, updatedAt: new Date().toISOString() };
  writeLocal(resume);
  if (userId) {
    const { error } = await supabase
      .from("user_resumes")
      .upsert(
        {
          user_id: userId,
          content,
          updated_at: resume.updatedAt ?? new Date().toISOString(),
          ...(fileName ? { file_name: fileName } : {}),
        },
        { onConflict: "user_id" },
      );
    if (error) throw error;
  }
  return resume;
}

export async function clearResume(userId?: string) {
  writeLocal(null);
  if (userId) {
    await supabase.from("user_resumes").delete().eq("user_id", userId);
  }
}

export async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
