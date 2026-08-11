import { supabase } from "@/integrations/supabase/client";
import type { ChatMode } from "@/lib/chat-modes";

export type ChatThread = {
  id: string;
  title: string;
  mode: string;
  updated_at: string;
};

export type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: ChatMode | null;
  data?: unknown;
};

export async function listThreads(): Promise<ChatThread[]> {
  const { data, error } = await supabase
    .from("chat_threads")
    .select("id,title,mode,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as ChatThread[];
}

export async function createThread(userId: string, title: string, mode: ChatMode) {
  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ user_id: userId, title: title.slice(0, 80) || "New chat", mode })
    .select("id,title,mode,updated_at")
    .single();
  if (error) throw error;
  return data as ChatThread;
}

export async function touchThread(threadId: string) {
  const { error } = await supabase
    .from("chat_threads")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", threadId);
  if (error) throw error;
}

export async function renameThread(threadId: string, title: string) {
  const { error } = await supabase
    .from("chat_threads")
    .update({ title: title.slice(0, 80) })
    .eq("id", threadId);
  if (error) throw error;
}

export async function deleteThread(threadId: string) {
  const { error } = await supabase.from("chat_threads").delete().eq("id", threadId);
  if (error) throw error;
}

export async function listMessages(threadId: string): Promise<ChatMsg[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,role,content,mode,data")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content ?? "",
    mode: (m.mode ?? null) as ChatMode | null,
    data: m.data ?? undefined,
  }));
}

export async function addMessage(args: {
  threadId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  mode: ChatMode;
  data?: unknown;
}) {
  const { error } = await supabase.from("chat_messages").insert({
    thread_id: args.threadId,
    user_id: args.userId,
    role: args.role,
    content: args.content,
    mode: args.mode,
    data: (args.data ?? null) as never,
  });
  if (error) throw error;
  await touchThread(args.threadId);
}
