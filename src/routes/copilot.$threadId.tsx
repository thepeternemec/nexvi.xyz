import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChatWindow } from "@/components/chat/chat-window";
import { useChatSidebar } from "@/components/chat/chat-sidebar-context";
import { listMessages } from "@/lib/chat-store";
import { isChatMode } from "@/lib/chat-modes";

export const Route = createFileRoute("/copilot/$threadId")({
  component: ThreadChat,
});

function ThreadChat() {
  const { threadId } = Route.useParams();
  const { openSidebar } = useChatSidebar();
  const messages = useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: () => listMessages(threadId),
  });

  if (messages.isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading conversation…</div>;
  }

  const list = messages.data ?? [];
  const lastMode = [...list].reverse().find((m) => isChatMode(m.mode ?? undefined))?.mode;

  return (
    <ChatWindow
      key={threadId}
      threadId={threadId}
      initialMessages={list}
      initialMode={lastMode ?? "cv"}
      onOpenSidebar={openSidebar}
    />
  );
}
