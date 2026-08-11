import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat/chat-window";
import { useChatSidebar } from "@/components/chat/chat-sidebar-context";
import { isChatMode, type ChatMode } from "@/lib/chat-modes";

export const Route = createFileRoute("/chat/")({
  validateSearch: (search: Record<string, unknown>): { mode?: ChatMode } => ({
    mode: isChatMode(typeof search.mode === "string" ? search.mode : undefined)
      ? (search.mode as ChatMode)
      : undefined,
  }),
  component: NewChat,
});

function NewChat() {
  const { mode } = Route.useSearch();
  const { openSidebar } = useChatSidebar();
  return <ChatWindow key={mode ?? "cv"} initialMode={mode ?? "cv"} onOpenSidebar={openSidebar} />;
}
